'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDemo } from '@/context/DemoStore'

export default function Dashboard() {
  const { state, user, refresh } = useDemo()
  const [loading, setLoading] = useState(false)

  if (!user) return <div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono text-[#0ea5e9]">INITIALIZING IDENT-LINK...</div>

  const submissionsCount = state.problems.filter(p => p.author_id === user.id).length
  const reviewsCount = state.reviews.filter(r => r.reviewer_id === user.id).length
  const mrsScore = state.mrs_scores[user.id] || 0
  
  // Center Feed: Sort by merit (simulated)
  const rankedProblems = [...state.problems]
    .filter(p => !p.parent_id)
    .sort((a, b) => (b.upvotes * 0.4 + b.avg_score * 0.4) - (a.upvotes * 0.4 + a.avg_score * 0.4))

  // Evolving solutions carousel data
  const evolving = state.problems
    .filter(p => p.parent_id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-12 px-6 lg:px-[6vw]">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: PERSONAL (3/12) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-lg font-bold text-[#0ea5e9]">
                {user.display_name.slice(0,1)}
               </div>
               <div>
                  <h2 className="font-serif text-2xl leading-none mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>{user.display_name}</h2>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{user.tier} // IDENTITY VERIFIED</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Merit (MRS)</div>
                <div className="text-xl font-bold text-[#0ea5e9]">{mrsScore.toFixed(1)}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Reputation (GRS)</div>
                <div className="text-xl font-bold">{user.grs_score}</div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Problems Submitted</span>
                <span className="text-xs font-mono font-bold">{submissionsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Blind Reviews Given</span>
                <span className="text-xs font-mono font-bold">{reviewsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Current Streak</span>
                <span className="text-xs font-mono font-bold text-orange-500">🔥 {user.streak}d</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-6 italic">// QUICK ACTIONS</h3>
            <div className="grid gap-3">
              <Link href="/submit" className="flex items-center justify-between p-4 bg-white/5 rounded-xl text-xs font-semibold hover:bg-[#0ea5e9] hover:text-black transition-all no-underline group">
                SUBMIT NEW CHALLENGE
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
              <Link href="/review/1" className="flex items-center justify-between p-4 bg-white/5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all no-underline">
                PENDING REVIEWS
                <span className="bg-[#0ea5e9]/20 text-[#0ea5e9] px-2 py-0.5 rounded text-[9px] tracking-tighter">8 ACTIVE</span>
              </Link>
              <Link href="/feed" className="flex items-center justify-between p-4 bg-white/5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all no-underline">
                VIEW DRAFTS
              </Link>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: RANKED FEED (6/12) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="font-serif text-3xl italic" style={{ fontFamily: "'Instrument Serif', serif" }}>Top Network Challenges</h3>
            <Link href="/feed" className="text-[10px] font-mono text-[#0ea5e9] uppercase tracking-widest no-underline hover:underline">View All Challenges →</Link>
          </div>
          
          <div className="space-y-4">
             {rankedProblems.map(p => (
               <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-mono text-[#0ea5e9] tracking-widest uppercase italic">Merit {p.avg_score.toFixed(1)}</span>
                  </div>
                  <div className="inline-block px-2 py-1 bg-[#0ea5e9]/10 text-[#0ea5e9] text-[9px] font-bold rounded mb-4 tracking-widest uppercase">
                    {p.category}
                  </div>
                  <Link href={`/problem/${p.id}`} className="no-underline group">
                    <h4 className="text-2xl font-serif mb-3 leading-tight tracking-tight group-hover:text-[#0ea5e9] transition-colors" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {p.title}
                    </h4>
                  </Link>
                  <p className="text-slate-400 text-sm font-light leading-relaxed mb-6 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-none">{p.upvotes}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Endorsements</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-none">{p.review_count}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Evaluations</span>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Link href={`/review/${p.id}`} className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 no-underline">Verify</Link>
                      <Link href={`/submit?parent=${p.id}`} className="px-4 py-2 border border-[#0ea5e9]/30 text-[#0ea5e9] rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-[#0ea5e9]/10 no-underline">Evolve</Link>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* RIGHT PANEL: DEBATE & EVOLUTION (3/12) */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#0ea5e9]/10 blur-3xl rounded-full" />
              <h3 className="text-[10px] font-mono text-[#0ea5e9] uppercase tracking-[0.2em] mb-8 italic">// DEBATE ARENA</h3>
              <div className="mb-8">
                <div className="text-[9px] font-mono text-slate-500 uppercase mb-4">Current Active deliberatons</div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl mb-4">
                  <div className="text-xs font-bold mb-2">Urban Heat mitigation</div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0ea5e9]" style={{ width: '64%' }} />
                  </div>
                  <div className="flex justify-between text-[9px] mt-2 text-slate-500 uppercase font-mono tracking-tighter">
                    <span>Synthesis Progress</span>
                    <span>64%</span>
                  </div>
                </div>
              </div>
              <Link href="/debate/p1" className="block w-full text-center py-3 bg-[#0ea5e9] text-black rounded-full text-xs font-bold tracking-widest no-underline hover:scale-[1.02] transition-transform">JOIN RAPID ROUND</Link>
           </div>

           <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-6 italic">// EVOLVING SOLUTIONS</h3>
              <div className="space-y-6">
                {evolving.length === 0 && <p className="text-xs text-slate-600 italic">No evolutions in current cycle.</p>}
                {evolving.map(evo => (
                  <div key={evo.id} className="relative pl-6">
                     <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-[#22c55e]" />
                     <div className="absolute left-[3px] top-3 bottom-[-24px] w-[1px] bg-white/5" />
                     <Link href={`/problem/${evo.id}`} className="no-underline group">
                        <div className="text-xs font-bold leading-tight group-hover:text-[#0ea5e9] transition-colors mb-1">{evo.title}</div>
                        <div className="text-[9px] text-slate-500 uppercase font-mono tracking-tighter">Branch from {evo.parent_id?.slice(0,4)}</div>
                     </Link>
                  </div>
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
