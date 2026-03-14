'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileTabBar() {
  const pathname = usePathname()

  const tabs = [
    { label: 'Feed', href: '/feed', icon: '◎' },
    { label: 'Submit', href: '/submit', icon: '⊕' },
    { label: 'Review', href: '/review/1', icon: '◈' },
    { label: 'Debate', href: '/debate/p1', icon: '⌗' },
    { label: 'Profile', href: '/dashboard', icon: '👤' }
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#080808]/90 backdrop-blur-xl border-t border-white/5 z-[1000] px-6 py-3">
      <div className="flex justify-between items-center gap-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.label === 'Review' && pathname?.startsWith('/review')) || (tab.label === 'Debate' && pathname?.startsWith('/debate'))
          return (
            <Link 
              key={tab.label} 
              href={tab.href}
              className="flex flex-col items-center gap-1 no-underline group"
            >
              <span 
                className={`text-xl transition-all duration-300 ${isActive ? 'text-[#0ea5e9] scale-110 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : 'text-slate-500 group-hover:text-slate-300'}`}
              >
                {tab.icon}
              </span>
              <span 
                className={`text-[9px] font-medium tracking-[0.05em] uppercase transition-colors duration-300 ${isActive ? 'text-[#0ea5e9]' : 'text-slate-600 group-hover:text-slate-400'}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
