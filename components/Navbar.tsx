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
      } else {
        setUser({ display_name: 'Iron Falcon', grs_score: 340, is_demo: true })
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        supabase.from('users').select('*').eq('id', session.user.id).single().then(({ data }: any) => {
          setUser(data)
        })
      } else {
        setUser({ display_name: 'Iron Falcon', grs_score: 340, is_demo: true })
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav style={{
      background: 'rgba(8,8,8,0.8)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '0 6vw',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <Link href="/" style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: '20px',
        fontWeight: 400,
        color: '#fff',
        textDecoration: 'none',
        letterSpacing: '-0.01em'
      }}>
        Upraxis
      </Link>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="hidden md:flex">
        {[
          ['Feed', '/feed'], 
          ['Submit', '/submit'], 
          ['Map', '/map'], 
          ['Leaderboard', '/leaderboard']
        ].map(([label, href]) => (
          <Link 
            key={href} 
            href={href} 
            style={{
              fontSize: '14px',
              color: pathname === href ? '#fff' : '#475569',
              textDecoration: 'none',
              fontWeight: '400',
              transition: 'color 0.2s',
              letterSpacing: '-0.01em'
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <Link href="/signup" style={{
          background: '#fff',
          color: '#000',
          padding: '8px 20px',
          borderRadius: '100px',
          fontSize: '13px',
          fontWeight: '500',
          textDecoration: 'none',
          letterSpacing: '-0.01em'
        }}>
          Get started
        </Link>
      </div>
    </nav>
  )
}
