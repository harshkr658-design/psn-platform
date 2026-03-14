'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { mockApi, Problem } from '@/lib/mockApi'

interface EvolutionTreeProps {
  parentId: string
  level: number
}

export default function EvolutionTree({ parentId, level }: EvolutionTreeProps) {
  const [children, setChildren] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const loadMore = async () => {
    if (expanded) {
      setExpanded(false)
      return
    }
    setLoading(true)
    try {
      const data = await mockApi.fetchChildren(parentId)
      setChildren(data)
      setExpanded(true)
    } finally {
      setLoading(false)
    }
  }

  // Auto-load first level children if small
  useEffect(() => {
    if (level === 0) {
      mockApi.fetchChildren(parentId).then(data => {
        if (data.length > 0) {
          setChildren(data)
          setExpanded(true)
        }
      })
    }
  }, [parentId, level])

  if (loading) return <div className="ml-8 mt-2 text-[10px] font-mono text-slate-600 animate-pulse tracking-widest uppercase">Fetching branch sequence...</div>

  return (
    <div className={`mt-2 ${level > 0 ? 'ml-8' : ''}`}>
      {children.length > 0 && expanded && (
        <div className="space-y-4 border-l border-white/5 pl-8 relative">
          {children.map(child => (
            <div key={child.id} className="group relative">
               <div className="absolute -left-8 top-6 w-8 h-[1px] bg-white/5" />
               <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6 hover:border-[#0ea5e9]/20 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-0.5 rounded bg-[#0ea5e9]/10 text-[#0ea5e9] text-[9px] font-bold uppercase tracking-tighter">THREAD_LVL_{level + 1}</span>
                    <span className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">{child.category}</span>
                  </div>
                  <Link href={`/problem/${child.id}`} className="no-underline group">
                    <h5 className="text-sm font-bold mb-2 group-hover:text-[#0ea5e9] transition-colors font-serif italic" style={{ fontFamily: "'Instrument Serif', serif" }}>{child.title}</h5>
                  </Link>
                  <p className="text-[12px] text-slate-500 leading-relaxed mb-4 line-clamp-1">{child.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] text-slate-600"><span className="text-white font-bold">{child.upvotes}</span> Endorse</div>
                    <div className="text-[10px] text-slate-600"><span className="text-[#0ea5e9] font-bold">{child.avg_score.toFixed(1)}</span> Merit</div>
                    <Link href={`/submit?parent=${child.id}`} className="ml-auto text-[10px] text-[#0ea5e9] font-bold uppercase tracking-widest no-underline hover:underline">Branch →</Link>
                  </div>
               </div>
               {/* Recursive tree */}
               <EvolutionTree parentId={child.id} level={level + 1} />
            </div>
          ))}
        </div>
      )}
      
      {!expanded && children.length === 0 && (
         <button 
           onClick={loadMore}
           className="ml-8 mt-2 text-[10px] font-mono text-slate-500 hover:text-[#0ea5e9] tracking-widest uppercase flex items-center gap-2 transition-colors"
         >
           <span>⊕ Show Evolutions</span>
         </button>
      )}
    </div>
  )
}
