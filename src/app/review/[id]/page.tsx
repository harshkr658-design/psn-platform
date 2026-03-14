'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDemo } from '@/context/DemoStore'

function ReviewContent() {
  const router = useRouter()
  const { id } = useParams()
  const { state, user, actions, refresh } = useDemo()
  
  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scores, setScores] = useState({ clarity: 3, feasibility: 3, evidence: 3, innovation: 3, realism: 3 })
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true)
      const p = await actions.fetchProblemById(id as string)
      if (!p) {
        setError('Mission node not found in current sector.')
      } else if (user && p.author_id === user.id) {
        setError('Operator cannot calibrate their own submission node.')
      } else {
        setProblem(p)
      }
      setLoading(false)
    }
    fetchProblem()
  }, [id, user])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleReviewSubmit = async () => {
    if (comment.length < 20) {
      showToast('Metadata comment must be at least 20 characters.', 'error')
      return
    }
    if (!user) return

    setSubmitting(true)
    try {
      await actions.submitReview(user.id, id as string, scores, comment)
      showToast('+50 GRS earned', 'success')
      await refresh()
      setTimeout(() => router.push('/feed'), 1500)
    } catch (err: any) {
      showToast(err.message || 'Calibration failure.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const liveAvg = Object.values(scores).reduce((a, b) => a + b, 0) / 5

  if (loading) return <div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono text-[#0ea5e9]">BOOTING_REVIEW_INTERFACE...</div>
  
  if (error) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8 border border-red-500/20 font-mono text-2xl">!</div>
      <h1 className="text-3xl font-serif mb-4 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>Node Access Denied</h1>
      <p className="text-slate-500 max-w-xs font-light">{error}</p>
      <button onClick={() => router.push('/feed')} className="mt-12 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Return to Feed</button>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 pb-20 px-6 md:px-[8vw]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 rounded-full border shadow-2xl animate-in zoom-in slide-in-from-top-4 duration-300 flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-[#0ea5e9]/10 border-[#0ea5e9]/40 text-[#0ea5e9]' : 'bg-red-500/10 border-red-500/40 text-red-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-[#0ea5e9] animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* PROBLEM STACK (7/12) */}
            <div className="lg:col-span-7 space-y-12">
                <div className="flex items-center gap-4 bg-purple-500/10 w-fit px-5 py-2 rounded-full border border-purple-500/20">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest leading-none">Blind Review Protocol Active</span>
                </div>

                <div>
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4 block italic">// ANALYZING_MISSION_NODE</span>
                   <h1 className="text-5xl font-serif leading-tight italic mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>{problem.title}</h1>
                   
                   <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-10">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 block italic opacity-60">PROBLEM_CONTEXT</label>
                        <p className="text-slate-300 text-lg font-light leading-relaxed">{problem.description}</p>
                      </div>
                      
                      {problem.evidence && (
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 block italic opacity-60">EVIDENCE_METADATA</label>
                          <div className="p-5 bg-black/40 border border-white/5 rounded-xl text-slate-400 text-sm font-mono leading-relaxed">
                            {problem.evidence}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 block italic opacity-60">PROPOSED_EVOLUTION</label>
                        <p className="text-[#0ea5e9] text-lg font-light leading-relaxed italic">{problem.proposed_solution || 'Node currently awaiting solution branch.'}</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 p-8 bg-white/[0.015] border border-white/5 rounded-3xl">
                   <div className="flex-1">
                      <div className="text-[9px] font-mono text-slate-600 uppercase mb-2">Classification</div>
                      <div className="text-xs font-bold uppercase tracking-widest">{problem.category}</div>
                   </div>
                   <div className="flex-1">
                      <div className="text-[9px] font-mono text-slate-600 uppercase mb-2">Current Endorsements</div>
                      <div className="text-xs font-bold font-mono tracking-tighter">{problem.upvotes} UPV</div>
                   </div>
                   <div className="flex-1">
                      <div className="text-[9px] font-mono text-slate-600 uppercase mb-2">Protocol Status</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-emerald-500">Active</div>
                   </div>
                </div>
            </div>

            {/* SCORING STACK (5/12) */}
            <div className="lg:col-span-5 relative">
               <div className="sticky top-24 space-y-8">
                  <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ea5e9]/5 blur-3xl rounded-full" />
                    
                    <div className="flex items-center justify-between mb-12">
                       <div>
                          <h3 className="text-[10px] font-mono text-[#0ea5e9] uppercase tracking-[0.2em] mb-2 italic">// SCORING_MATRIX_v2</h3>
                          <p className="text-xs text-slate-500 font-light max-w-[200px]">Quantify the quality of this intelligence node.</p>
                       </div>
                       <div className="text-right">
                          <div className="text-5xl font-serif italic text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>{liveAvg.toFixed(1)}</div>
                          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest pt-1">AVG_SCORE</div>
                       </div>
                    </div>

                    <div className="space-y-10 mb-12">
                      {[
                        { id: 'clarity', label: 'Definition Clarity', desc: 'Is the problem clearly stated and bounded?' },
                        { id: 'feasibility', label: 'Solution Feasibility', desc: 'Can this actually be implemented/built?' },
                        { id: 'evidence', label: 'Evidence Strength', desc: 'Are claims backed by context or data?' },
                        { id: 'innovation', label: 'Innovation Level', desc: 'How original or efficient is the approach?' },
                        { id: 'realism', label: 'Pragmatic Realism', desc: 'Does it account for real-world friction?' }
                      ].map((s) => (
                        <div key={s.id} className="group/slider">
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{s.label}</h4>
                              <p className="text-[10px] text-slate-600 italic font-light">{s.desc}</p>
                            </div>
                            <span className="font-mono text-[#0ea5e9] text-lg font-bold">{(scores as any)[s.id]}</span>
                          </div>
                          <input 
                            type="range" min="1" max="5" step="1"
                            value={(scores as any)[s.id]}
                            onChange={(e) => setScores(prev => ({ ...prev, [s.id]: parseInt(e.target.value) }))}
                            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#0ea5e9] hover:bg-white/10 transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mb-12">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 block italic opacity-60">// CALIBRATION_COMMENT</label>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Provide deep architectural feedback (min 20 chars)..."
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm font-light focus:outline-none focus:border-[#0ea5e9]/30 transition-all resize-none min-h-[140px]"
                      />
                      <div className="flex justify-end mt-2">
                        <span className={`text-[9px] font-mono tracking-tighter ${comment.length < 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {comment.length}/20 chars
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={handleReviewSubmit}
                      disabled={submitting || !user}
                      className="w-full py-6 bg-white text-black rounded-2xl font-bold text-sm tracking-[0.2em] uppercase hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Recording Consensus...' : 'Record Blind Review'}
                    </button>
                    
                    {!user && (
                      <p className="text-[10px] text-red-500/70 text-center mt-4 font-mono uppercase tracking-widest animate-pulse">Identity Link Required to record merit</p>
                    )}
                  </div>
               </div>
            </div>

        </div>
      </div>
    </main>
  )
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono text-slate-500 uppercase tracking-widest">Booting_Review_Core...</div>}>
      <ReviewContent />
    </Suspense>
  )
}
