'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
            PSN<span style={{color:'#0ea5e9'}}>.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'FEED', href: '/feed' },
              { label: 'SUBMIT', href: '/submit' },
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
                  {user.display_name?.slice(0, 1) || 'V'}
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
          { label: 'DASHBOARD', href: '/dashboard', icon: '◈' }
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',textDecoration:'none',padding:'8px 0'}}>
            <span style={{fontSize:'18px', color: pathname === item.href ? '#0ea5e9' : '#fff'}}>{item.icon}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color: pathname === item.href ? '#0ea5e9' : '#64748b',letterSpacing:'0.1em'}}>{item.label}</span>
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
