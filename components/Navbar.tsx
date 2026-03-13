'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        setUser(data)
      }
    }
    getUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        supabase.from('users').select('*').eq('id', session.user.id).single().then(({ data }: any) => setUser(data))
      } else {
        setUser(null)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const navLinks = [
    { name: 'Feed', href: '/feed' },
    { name: 'Submit', href: '/submit' },
    { name: 'Review', href: '/feed' }, // Link to feed to pick a problem
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#0ea5e9] rounded-lg flex items-center justify-center font-black text-black text-xl italic group-hover:scale-110 transition-transform">P</div>
            <span className="font-black italic tracking-tighter text-lg hidden sm:block">PSN</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${pathname === link.href ? 'text-[#0ea5e9]' : 'text-slate-400 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 rounded-full">
                <span className="text-[10px] font-black text-[#0ea5e9] tracking-widest">{user.grs_score || 0} GRS</span>
              </div>
              
              <NotificationBell userId={user.id} />

              <Link href="/dashboard" className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                  {user.display_name?.slice(0, 1) || 'V'}
                </div>
                <div className="hidden lg:block">
                  <div className="text-[10px] font-bold text-white uppercase tracking-tight leading-none mb-0.5">{user.display_name}</div>
                  <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none">{user.tier}</div>
                </div>
              </Link>
            </>
          ) : (
            <Link href="/login" className="px-6 py-2 bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors">
              Access Node
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around h-16 px-2">
        {[
          { icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', label: 'Feed', href: '/feed' },
          { icon: 'M12 4v16m8-8H4', label: 'Submit', href: '/submit' },
          { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Review', href: '/feed' },
          { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile', href: '/dashboard' }
        ].map((item) => (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 ${pathname === item.href ? 'text-[#0ea5e9]' : 'text-slate-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
