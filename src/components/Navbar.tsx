'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDemo } from '@/context/DemoStore'

export default function Navbar() {
  const pathname = usePathname()
  const { user } = useDemo()
  const [search, setSearch] = useState('')

  const categories = ['Technology', 'Education', 'Environment', 'Health', 'Economy']

  return (
    <nav 
      style={{
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '0 6vw',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <div className="flex items-center gap-12">
        <Link href="/" style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: '24px',
          fontWeight: 400,
          color: '#fff',
          textDecoration: 'none',
          letterSpacing: '-0.01em'
        }}>
          PSN<span className="text-[#0ea5e9]">.</span>
        </Link>

        {/* Global Search */}
        <div className="hidden lg:flex items-center relative">
          <input 
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-full px-5 py-1.5 text-[13px] w-64 focus:outline-none focus:border-[#0ea5e9]/30 transition-all font-light"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <span className="absolute right-4 text-[10px] text-slate-600 font-mono tracking-widest uppercase pointer-events-none">⌘K</span>
        </div>

        {/* Category Pills */}
        <div className="hidden xl:flex items-center gap-6 ml-4">
          {categories.map(cat => (
            <Link 
              key={cat}
              href={`/feed?category=${cat}`}
              className="text-[11px] font-medium text-slate-500 hover:text-[#0ea5e9] transition-colors uppercase tracking-[0.1em] no-underline"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-8 mr-4">
          {[
            ['Feed', '/feed'], 
            ['Map', '/map'], 
            ['Merit', '/leaderboard']
          ].map(([label, href]) => (
            <Link 
              key={href} 
              href={href} 
              style={{
                fontSize: '13px',
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
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-4 no-underline group">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[#0ea5e9] tracking-widest leading-none">{user.grs_score} GRS</span>
                <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase">{user.tier}</span>
              </div>
              <div 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold transition-all group-hover:border-[#0ea5e9]/50"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {user.display_name?.slice(0, 1)}
              </div>
            </Link>
          ) : (
            <Link href="/signup" style={{
              background: '#fff',
              color: '#000',
              padding: '8px 24px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: '500',
              textDecoration: 'none',
              letterSpacing: '-0.01em'
            }}>
              Get started
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
