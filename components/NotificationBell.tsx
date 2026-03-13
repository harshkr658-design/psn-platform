'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!userId) return
    loadNotifications()
    
    // Subscribe to new notifications
    const channel = supabase.channel('realtime_notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, 
      () => {
        loadNotifications()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  async function loadNotifications() {
    const { data } = await supabase.from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    setNotifications(data || [])
    setUnreadCount(data?.filter((n: any) => !n.read).length || 0)
  }

  async function markRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    loadNotifications()
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0ea5e9] text-black text-[10px] font-black flex items-center justify-center rounded-full animate-bounce shadow-[0_0_10px_#0ea5e9]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notifications</span>
              {unreadCount > 0 && <span className="text-[9px] text-[#0ea5e9] font-bold">{unreadCount} New</span>}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => markRead(n.id)}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.read ? 'bg-[#0ea5e9]/5 border-l-2 border-l-[#0ea5e9]' : ''}`}
                >
                  <p className="text-xs text-slate-300 leading-snug">{n.message}</p>
                  <span className="text-[9px] text-slate-600 mt-2 block italic">{new Date(n.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="p-8 text-center text-slate-600 text-xs italic">No activity detected yet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
