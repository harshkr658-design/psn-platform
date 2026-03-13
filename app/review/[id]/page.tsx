'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ReviewPage() {
  const router = useRouter()
  const { id } = useParams()
  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scores, setScores] = useState({ clarity: 3, feasibility: 3, evidence: 3, innovation: 3, realism: 3 })
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUserId(session.user.id)
      await fetchProblem(session.user.id)
    }
    init()
  }, [id])

  async function fetchProblem(uid: string) {
    setLoading(true)
    try {
      // Check for existing review
      const { data: existing } = await supabase.from('reviews').select('id').eq('problem_id', id).eq('reviewer_id', uid).single()
      if (existing) {
        setError('You have already reviewed this submission.')
        setLoading(false)
        return
      }

      const { data } = await supabase.from('problems').select('*').eq('id', id).single()
      if (!data) {
        setError('Problem not found.')
      } else if (data.author_id === uid) {
        setError('You cannot review your own submission.')
      } else {
        setProblem(data)
      }
    } catch (e) {
      console.error(e)
      setError('System error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  async function submitReview() {
    if (!userId || !problem || submitting) return
    setSubmitting(true)
    
    try {
      const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5
      
      // 1. Insert review
      const { error: rError } = await supabase.from('reviews').insert({
        problem_id: id,
        reviewer_id: userId,
        clarity_score: scores.clarity,
        feasibility_score: scores.feasibility,
        evidence_score: scores.evidence,
        innovation_score: scores.innovation,
        realism_score: scores.realism,
        comment
      })
      if (rError) throw rError

      // 2. Update problem score
      const { data: allReviews } = await supabase.from('reviews').select('clarity_score, feasibility_score, evidence_score, innovation_score, realism_score').eq('problem_id', id)
      
      if (allReviews) {
        const totalAvg = allReviews.reduce((acc, r) => {
          const rAvg = (r.clarity_score + r.feasibility_score + r.evidence_score + r.innovation_score + r.realism_score) / 5
          return acc + rAvg
        }, 0) / allReviews.length

        await supabase.from('problems').update({
          avg_score: totalAvg,
          review_count: allReviews.length
        }).eq('id', id)
      }

      // 3. Update User GRS
      const { data: profile } = await supabase.from('users').select('grs_score').eq('id', userId).single()
      const newScore = (profile?.grs_score || 0) + 50
      await supabase.from('users').update({ grs_score: newScore }).eq('id', userId)
      await supabase.from('grs_log').insert({ user_id: userId, action_type: 'Blind review given', points: 50 })

      // 4. Update MRS Accuracy (Placeholder logic: deviation from global average)
      // For actual MRS, we'd need more complex analysis, but we'll increment review_count at least
      const { data: mrs } = await supabase.from('mrs_scores').select('review_count').eq('user_id', userId).single()
      if (mrs) {
        await supabase.from('mrs_scores').update({ review_count: (mrs.review_count || 0) + 1 }).eq('user_id', userId)
      } else {
        await supabase.from('mrs_scores').insert({ user_id: userId, review_count: 1 })
      }

      // 5. Notify Author
      if (problem.author_id) {
        await supabase.from('notifications').insert({
          user_id: problem.author_id,
          type: 'review',
          message: `Someone reviewed your submission: ${problem.title}`
        })
      }

      router.push('/feed')
    } catch (e) {
      console.error(e)
      alert('Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  const liveAvg = Object.values(scores).reduce((a, b) => a + b, 0) / 5

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#0ea5e9]">Initializing Blind Review Node...</div>
  
  if (error) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">!</div>
      <h1 className="text-2xl font-bold mb-2">Review Blocked</h1>
      <p className="text-slate-500 max-w-xs">{error}</p>
      <button onClick={() => router.push('/feed')} className="mt-8 text-[#0ea5e9] font-bold text-sm">Return to Feed</button>
    </div>
  )

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 bg-purple-500/10 w-fit px-4 py-2 rounded-full border border-purple-500/20">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest leading-none">Blind Review Mode Active</span>
        </div>

        <div className="mb-12">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em] mb-4 block">Analyzing Mission</span>
          <h1 className="text-4xl font-bold mb-6 italic tracking-tight">{problem.title}</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Background / Description</label>
                <p className="text-slate-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5">{problem.description}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Evidence / Context</label>
                <div className="text-slate-400 text-sm italic">{problem.evidence || 'No evidence provided.'}</div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Proposed Evolution</label>
                <p className="text-slate-300 leading-relaxed bg-[#0ea5e9]/5 p-6 rounded-2xl border border-[#0ea5e9]/10">{problem.proposed_solution}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Target Impact</label>
                <div className="text-slate-400 text-sm">{problem.impact}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ea5e9]/5 blur-3xl rounded-full" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-12">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Scoring</h2>
              <p className="text-sm text-slate-500">Evaluate based on objective constraints and merit.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#0ea5e9] tracking-tighter">{liveAvg.toFixed(1)}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Current Grade</div>
            </div>
          </div>

          <div className="space-y-10 mb-12">
            {[
              { id: 'clarity', label: 'Definition Clarity', desc: 'Is the problem clearly stated and bounded?' },
              { id: 'feasibility', label: 'Solution Feasibility', desc: 'Can this actually be built/implemented?' },
              { id: 'evidence', label: 'Evidence Strength', desc: 'Are claims backed by context or data?' },
              { id: 'innovation', label: 'Innovation Level', desc: 'How original or efficient is the approach?' },
              { id: 'realism', label: 'Pragmatic Realism', desc: 'Does it account for real-world friction?' }
            ].map((s) => (
              <div key={s.id}>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="font-bold text-sm tracking-wide">{s.label}</h4>
                    <p className="text-[11px] text-slate-500 italic">{s.desc}</p>
                  </div>
                  <span className="font-mono text-[#0ea5e9] text-xl font-bold">{(scores as any)[s.id]}</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="1"
                  value={(scores as any)[s.id]}
                  onChange={(e) => setScores(prev => ({ ...prev, [s.id]: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#0ea5e9]"
                />
              </div>
            ))}
          </div>

          <div className="mb-12">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Internal Comment (Optional)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide constructive metadata for the author..."
              className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#0ea5e9]/50 transition-all resize-none min-h-[100px]"
            />
          </div>

          <button 
            onClick={submitReview}
            disabled={submitting}
            className="w-full py-5 bg-[#0ea5e9] text-black rounded-2xl font-black text-xl tracking-tight hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {submitting ? 'Transmitting Data...' : 'Submit Blind Review →'}
          </button>
        </div>
      </div>
    </main>
  )
}
