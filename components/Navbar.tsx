'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifs, setShowNotifs] = useState(false)
  
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        setUser(data)
        fetchNotifications(session.user.id)
      }
    }
    getUser()
    
    async function fetchNotifications(uid: string) {
      const { data, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(10)
      
      setNotifications(data || [])
      
      const { count: unread } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid)
        .eq('read', false)
      
      setUnreadCount(unread || 0)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        supabase.from('users').select('*').eq('id', session.user.id).single().then(({ data }: any) => {
          setUser(data)
          fetchNotifications(session.user.id)
        })
      } else {
        // Mock demo user for Navbar
        setUser({ display_name: 'Iron Falcon', grs_score: 340, is_demo: true })
        setNotifications([])
        setUnreadCount(0)
      }
    })
    
    // Initial demo state if no session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setUser({ display_name: 'Iron Falcon', grs_score: 340, is_demo: true })
    })

    return () => subscription.unsubscribe()
  }, [])

  async function markRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  async function markAllRead() {
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('id', user.id).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <>
      <nav style={{
        background:'rgba(0,0,0,0.8)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid #0f172a',
        padding:'0 24px',
        height:'56px',
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        position:'fixed',
        top:0,
        left:0,
        right:0,
        zIndex:1000
      }}>
        <div className="flex items-center gap-12">
          <Link href="/" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',letterSpacing:'0.15em',color:'#fff',textDecoration:'none'}}>
            UPRAXIS<span style={{color:'#0ea5e9'}}>.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'FEED', href: '/feed' },
              { label: 'SUBMIT', href: '/submit' },
              { label: 'LEADERBOARD', href: '/leaderboard' },
              { label: 'DASHBOARD', href: '/dashboard' }
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                style={{
                  fontFamily:"'JetBrains Mono',monospace",
                  fontSize:'11px',
                  color: pathname === link.href ? '#fff' : '#64748b',
                  textDecoration:'none',
                  letterSpacing:'0.1em',
                  transition:'color 0.2s'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <span style={{ fontSize: '18px' }}>🔔</span>
                  {unreadCount > 0 && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-black">
                      {unreadCount}
                    </div>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#050a14] border border-[#0f172a] rounded-xl shadow-2xl p-4 z-[1100]">
                    <div className="flex justify-between items-center mb-4 pb-2 border-bottom border-[#0f172a]">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notifications</span>
                      <button onClick={markAllRead} className="text-[9px] text-[#0ea5e9] uppercase font-bold hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 && <div className="text-center py-8 text-slate-600 text-[11px]">No notifications yet</div>}
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => { markRead(n.id); setShowNotifs(false); }}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${n.read ? 'bg-transparent text-slate-500' : 'bg-[#0ea5e9]/5 text-white'}`}
                        >
                          <div className="text-[12px] mb-1">{n.message}</div>
                          <div className="text-[9px] text-[#334155]">{new Date(n.created_at).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',letterSpacing:'0.15em',color:'#0ea5e9',border:'1px solid rgba(14,165,233,0.3)',padding:'4px 10px',borderRadius:'2px'}}>
                {user.grs_score || 0} GRS
              </div>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div style={{
                  width:'24px',
                  height:'24px',
                  borderRadius:'2px',
                  background:'rgba(14,165,233,0.1)',
                  border:'1px solid rgba(14,165,233,0.2)',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize:'10px',
                  fontFamily:"'JetBrains Mono',monospace",
                  color:'#0ea5e9'
                }}>
                  {user.display_name?.slice(0, 1) || 'U'}
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/login" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#fff',textDecoration:'none',letterSpacing:'0.1em'}}>
              ACCESS NODE
            </Link>
          )}
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',letterSpacing:'0.15em',color:'#0ea5e9',border:'1px solid rgba(14,165,233,0.3)',padding:'4px 10px',borderRadius:'2px'}} className="hidden sm:block uppercase">BETA</div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav style={{
        display:'none',
        position:'fixed',
        bottom:0,
        left:0,
        right:0,
        background:'rgba(0,0,0,0.95)',
        backdropFilter:'blur(20px)',
        borderTop:'1px solid #0f172a',
        padding:'8px 0',
        zIndex:1000
      }} className="mobile-nav">
        {[
          { label: 'FEED', href: '/feed', icon: '◎' },
          { label: 'SUBMIT', href: '/submit', icon: '⊕' },
          { label: 'REVIEW', href: '/review/1', icon: '◈' },
          { label: 'PROFILE', href: '/dashboard', icon: '👤' }
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',textDecoration:'none',padding:'8px 0'}}>
            <span style={{fontSize:'18px', color: (pathname === item.href || (item.label === 'REVIEW' && pathname?.startsWith('/review'))) ? '#0ea5e9' : '#fff'}}>{item.icon}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color: (pathname === item.href || (item.label === 'REVIEW' && pathname?.startsWith('/review'))) ? '#0ea5e9' : '#64748b',letterSpacing:'0.1em'}}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  )
}
