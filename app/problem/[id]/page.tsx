'use client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function ProblemDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [upvoted, setUpvoted] = useState(false)

  // Demo Data for Problem 1
  const problem = {
    id: '1',
    title: 'Social media algorithms optimizing for outrage and division',
    description: 'Current engagement metrics ignore the long-term societal cost of polarized discourse and mental health decline. Major platforms use engagement-based ranking that amplifies emotionally charged content over factually accurate content, eroding shared reality.',
    impact: 'Weakened democratic institutions, increased teenage depression rates, and social fragmentation. MIT study found false news spreads 6x faster than true news.',
    evidence: 'Platform X internal reports indicate engagement increases by 34% for negative emotional triggers. Pervasive echo chambers confirmed in 2024 global digital report.',
    proposed_solution: 'Implement an "Epistemic Merit" layer that decouples visibility from engagement and integrates it with factual verification. Mandate algorithmic transparency and offer chronological feed options.',
    category: 'Technology',
    upvotes: 847,
    review_count: 12,
    avg_score: 4.3,
    breakdown: {
      clarity: 4.1,
      feasibility: 3.8,
      evidence: 4.7,
      innovation: 3.9,
      realism: 4.2
    },
    evolutions: [
      { id: '101', title: 'Algorithmic transparency laws could force platforms to open their ranking logic', category: 'Technology', upvotes: 23 },
      { id: '102', title: 'User-controlled feed settings as default rather than opt-in', category: 'Technology', upvotes: 18 }
    ],
    reviews: [
      { author: 'Anonymous Reviewer', score: 4.6, comment: 'Extremely well-evidenced. The MIT study citation is compelling. Solution pathway needs more specificity around implementation.' },
      { author: 'Anonymous Reviewer', score: 4.1, comment: 'Clear problem definition. Feasibility concerns around regulatory enforcement in non-democratic contexts.' },
      { author: 'Anonymous Reviewer', score: 4.3, comment: 'Original framing of the outrage-accuracy tradeoff. Impact section could quantify harms more precisely.' }
    ]
  }

  if (id !== '1' && id !== '2' && id !== '3' && id !== '4' && id !== '5' && id !== '6' ) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MISSION NOT FOUND</h1>
        <p className="text-slate-500 mb-8">Node '{id}' has not yet been processed by the Intelligence Network.</p>
        <button onClick={() => router.push('/feed')} className="text-[#0ea5e9] font-mono font-bold">RETURN TO MISSIONS BOARD</button>
      </div>
    )
  }

  // Visual bar component
  const ScoreBar = ({ label, score }: { label: string, score: number }) => (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono font-bold text-[#0ea5e9]">{score.toFixed(1)}</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#0ea5e9]" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/feed" className="text-slate-500 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest no-underline">
            ← BACK TO MISSIONS
          </Link>
          <span className="text-[10px] font-bold bg-[#0ea5e9] text-black px-2 py-0.5 rounded leading-none italic uppercase">{problem.category}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl md:text-6xl font-black mb-8 italic tracking-tight italic" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {problem.title.toUpperCase()}
            </h1>
            
            <div className="flex flex-wrap gap-8 py-8 border-y border-white/5 mb-12">
              {[
                { label: 'UPVOTES', value: problem.upvotes + (upvoted ? 1 : 0) },
                { label: 'REVIEWS', value: problem.review_count },
                { label: 'MERIT SCORE', value: problem.avg_score, color: '#0ea5e9' }
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[9px] font-bold text-slate-500 tracking-[0.2em] mb-1 uppercase">{s.label}</div>
                  <div className="text-3xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: s.color || '#fff' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <section className="space-y-12">
              <div>
                <h3 className="text-[10px] font-bold text-[#0ea5e9] tracking-[0.3em] mb-4 uppercase leading-none italic">// PROBLEM SYNOPSIS</h3>
                <p className="text-xl text-slate-300 leading-relaxed font-light">{problem.description}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-4 uppercase leading-none italic">// EVIDENCE CASE</h3>
                  <p className="text-sm text-slate-400 leading-relaxed italic">{problem.evidence}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-4 uppercase leading-none italic">// SYSTEMIC IMPACT</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{problem.impact}</p>
                </div>
              </div>
              <div className="bg-[#0ea5e910] border border-[#0ea5e930] rounded-3xl p-12">
                <h3 className="text-[10px] font-bold text-[#0ea5e9] tracking-[0.3em] mb-6 uppercase leading-none italic">// PROPOSED EVOLUTION</h3>
                <p className="text-2xl font-bold italic leading-tight italic" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
                  {problem.proposed_solution.toUpperCase()}
                </p>
              </div>
            </section>

            {/* Evolutions Section */}
            <section className="mt-20">
              <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-8 uppercase leading-none italic px-4">// EVOLUTION THREAD (2)</h3>
              <div className="space-y-4">
                {problem.evolutions.map(evo => (
                  <div key={evo.id} className="bg-[#050a14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
                    <div className="absolute left-0 top-0 w-1 h-full bg-[#0ea5e930]" />
                    <div className="flex justify-between items-center">
                      <div>
                         <span className="text-[8px] font-bold text-[#0ea5e9] uppercase tracking-widest mb-2 block italic">Child Evolution</span>
                         <h4 className="text-lg font-bold italic leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{evo.title.toUpperCase()}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500">▲ {evo.upvotes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Reviews */}
            <section className="mt-20">
              <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-8 uppercase leading-none italic px-4">// INTELLIGENCE LOGS</h3>
              <div className="space-y-6">
                {problem.reviews.map((r, i) => (
                  <div key={i} className="bg-black border-l-2 border-white/5 pl-8 py-2">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{r.author} // CORE INDEXED</span>
                      <span className="text-xs font-bold text-[#0ea5e9] italic">{r.score.toFixed(1)} AVG</span>
                    </div>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 leading-relaxed italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#050a14] border border-white/5 rounded-3xl p-8 sticky top-24">
              <h3 className="text-[10px] font-bold text-white tracking-[0.3em] mb-8 uppercase leading-none italic">// ACCESS PANEL</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => setUpvoted(!upvoted)}
                  className={`w-full py-5 rounded-2xl font-black text-xl tracking-tight transition-all flex items-center justify-center gap-3 ${upvoted ? 'bg-[#0ea5e9] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <span className="text-2xl leading-none">▲</span>
                  {upvoted ? 'ENDORSED' : 'ENDORSE MISSION'}
                </button>
                <Link 
                  href={`/review/${id}`}
                  className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xl tracking-tight hover:bg-white/10 transition-all flex items-center justify-center no-underline"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  REVIEW MISSION →
                </Link>
                <Link 
                  href={`/submit?parent=${id}`}
                  className="w-full py-5 bg-transparent border border-white/10 text-slate-500 rounded-2xl font-black text-xl tracking-tight hover:text-white hover:border-white/30 transition-all flex items-center justify-center no-underline"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  EVOLVE IDEA
                </Link>
              </div>

              <div className="mt-12">
                <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-8 uppercase leading-none italic">// MERIT BREAKDOWN</h3>
                <div className="space-y-2">
                  <ScoreBar label="Definition Clarity" score={problem.breakdown.clarity} />
                  <ScoreBar label="Feasibility" score={problem.breakdown.feasibility} />
                  <ScoreBar label="Evidence Strength" score={problem.breakdown.evidence} />
                  <ScoreBar label="Innovation" score={problem.breakdown.innovation} />
                  <ScoreBar label="Pragmatic Realism" score={problem.breakdown.realism} />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <button className="w-full text-slate-500 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-all">
                  ◈ INITIALIZE SHARE PROTOCOL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
