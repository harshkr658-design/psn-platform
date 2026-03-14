'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDemo } from '@/context/DemoStore'
import EvolutionTree from './EvolutionTree'

const categoryColors: Record<string, string> = {
  Environment: '#22c55e', Social: '#a855f7', Technology: '#3b82f6',
  Health: '#ef4444', Education: '#14b8a6', Economy: '#f59e0b', Other: '#64748b'
}

export default function FeedClient() {
  const { state, user, actions, refresh } = useDemo()
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('merit')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = ['All', ...Object.keys(categoryColors)]

  const calculateMerit = (p: any) => {
    const authorMrs = state.mrs_scores[p.author_id] || 3.0
    const meritWeight = (p.avg_score * 0.5) + (authorMrs * 0.2) + (Math.log10(p.upvotes + 1) * 0.3)
    return meritWeight
  }

  const upvote = async (problemId: string) => {
    if (!user) return
    await actions.upvoteProblem(user.id, problemId)
    refresh()
  }

  const filtered = state.problems
    .filter(p => !p.parent_id)
    .filter(p => filter === 'All' || p.category === filter)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'merit') return calculateMerit(b) - calculateMerit(a)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="text-[10px] font-mono text-[#0ea5e9] tracking-[0.3em] uppercase mb-4 opacity-70 italic">// NETWORK CORE FEED</div>
          <h1 className="text-5xl font-serif italic mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Active Challenges</h1>
          <p className="text-slate-500 text-sm font-light">Ranked by contributor merit-record weight and community consensus.</p>
        </div>
        
        <div className="flex flex-col gap-4">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Filter network nodes..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 text-xs w-full md:w-72 focus:outline-none focus:border-[#0ea5e9]/40 transition-all font-light"
              />
              <span className="absolute right-4 top-2.5 text-[10px] text-slate-700 font-mono tracking-widest uppercase">Search</span>
           </div>
           <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-xl self-end">
              {['merit', 'new'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setSort(s)}
                  className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${sort === s ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6 mb-12 scrollbar-hide border-b border-white/5">
        {categories.map(c => (
          <button 
            key={c} 
            onClick={() => setFilter(c)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all border ${filter === c ? 'bg-[#0ea5e9] border-[#0ea5e9] text-black shadow-[0_0_20px_rgba(14,165,233,0.2)]' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {filtered.length === 0 && (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500 font-mono text-[11px] tracking-widest uppercase">No matching problem nodes found.</p>
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 hover:border-white/[0.08] transition-all relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="text-[10px] font-mono text-[#0ea5e9] tracking-widest italic font-bold">MERIT_W {calculateMerit(p).toFixed(2)}</div>
               </div>
               
               <div className="flex items-center gap-4 mb-6">
                 <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] bg-white/5 border border-white/10" style={{ color: categoryColors[p.category] || '#fff' }}>
                  {p.category}
                 </span>
                 {p.avg_score >= 4 && (
                   <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20">Verified Merit</span>
                 )}
                 {p.review_count >= 10 && (
                   <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] bg-purple-500/10 text-purple-500 border border-purple-500/20">Peer Stalwart</span>
                 )}
               </div>

               <Link href={`/problem/${p.id}`} className="no-underline group/title">
                  <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-4 group-hover/title:text-[#0ea5e9] transition-colors italic" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    {p.title}
                  </h2>
               </Link>
               
               <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed mb-8 max-w-2xl line-clamp-3">
                {p.description}
               </p>

               <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold font-serif leading-none italic">{p.upvotes}</span>
                      <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase mt-1">Endorsements</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold font-serif leading-none italic">{p.review_count}</span>
                      <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase mt-1">Evaluations</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold font-serif leading-none italic text-[#0ea5e9]">{p.avg_score.toFixed(1)}</span>
                      <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase mt-1">Confidence</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => upvote(p.id)}
                      className={`p-3 rounded-2xl transition-all border ${state.upvotes_log.find(l => l.user_id === user?.id && l.problem_id === p.id) ? 'bg-[#0ea5e9] border-[#0ea5e9] text-black shadow-lg shadow-[#0ea5e9]/30' : 'bg-white/5 border-white/5 text-slate-400 hover:border-[#0ea5e9]/40 hover:text-white'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <Link href={`/review/${p.id}`} className="px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 no-underline transition-all">Evaluate</Link>
                    <Link href={`/submit?parent=${p.id}`} className="px-6 py-3 bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 text-[#0ea5e9] rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#0ea5e9]/10 no-underline transition-all">Evolve</Link>
                  </div>
               </div>
            </div>
            
            {/* Thread Expander */}
            <EvolutionTree parentId={p.id} level={0} />
          </div>
        ))}
      </div>
    </div>
  )
}
