'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { mockApi, Problem } from '@/lib/mockApi'
import DebateArena from '@/components/DebateArena'

function DebateContent() {
  const { problemId } = useParams()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockApi.fetchProblemById(problemId as string).then(p => {
      setProblem(p || null)
      setLoading(false)
    })
  }, [problemId])

  if (loading) return <div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono text-[#0ea5e9]">BOOTING_ARENA_NODE...</div>
  
  if (!problem) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-serif mb-4 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>Sector Not Found</h1>
      <p className="text-slate-500 max-w-xs font-light">The requested problem node does not exist in the deliberation grid.</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 pb-20 px-6 md:px-[8vw]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
               <div className="px-3 py-1 rounded bg-[#0ea5e9]/10 text-[#0ea5e9] text-[9px] font-bold uppercase tracking-widest border border-[#0ea5e9]/20">Active Deliberation</div>
               <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase italic">{problem.category} // SECTOR_{problem.id.slice(0,4)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>{problem.title}</h1>
            <p className="text-slate-500 text-lg font-light max-w-2xl">{problem.description}</p>
        </div>

        <DebateArena problemId={problemId as string} />
      </div>
    </main>
  )
}

export default function DebatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono text-slate-500 uppercase tracking-widest">Booting_Deliberation_Space...</div>}>
      <DebateContent />
    </Suspense>
  )
}
