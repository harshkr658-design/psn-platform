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
  const [showSuccess, setShowSuccess] = useState(false)

  const DEMO_PROBLEMS = [
    { id: '1', title: 'Social media algorithms optimise for outrage rather than accuracy', description: 'Major platforms use engagement-based ranking that amplifies emotionally charged content over factually accurate content, eroding shared reality.', evidence: 'MIT study found false news spreads 6x faster than true news. Facebook internal research showed algorithm changes boosted anger reactions.', proposed_solution: 'Mandate algorithmic transparency. Require platforms to offer a chronological feed option.', category: 'Technology', impact: 'Affects 4.9 billion social media users globally.' },
    { id: '2', title: 'Students memorise answers rather than developing critical thinking', description: 'Education systems globally optimise for standardised test scores, rewarding memorisation over reasoning, questioning, and creation.', evidence: 'PISA 2022 data shows students significantly underperform in open-ended reasoning vs recall tasks globally.', proposed_solution: 'Replace percentage-based grading with competency portfolios. Introduce Socratic method.', category: 'Education', impact: 'Affects 1.5 billion students currently in formal education globally.' },
    { id: '3', title: 'Urban air pollution disproportionately affects low-income communities', description: 'Industrial facilities and highways are systematically located near low-income areas, exposing those with least political power to highest environmental health risks.', evidence: 'EPA data shows communities of colour are 1.5x more likely to live near industrial polluters.', proposed_solution: 'Mandate environmental impact assessments that include demographic analysis.', category: 'Environment', impact: 'Estimated 200 million people live within 1km of a major pollution source globally.' },
    { id: '4', title: 'Mental health support is inaccessible to most people who need it', description: 'The global mental health system is severely under-resourced, leaving the majority without access to professional support due to cost, availability, and stigma.', evidence: 'WHO: 75% of people with mental disorders in low-income countries receive no treatment.', proposed_solution: 'Train peer support specialists at community level. Integrate into primary healthcare.', category: 'Health', impact: 'WHO estimates 1 in 8 people globally live with a mental disorder.' },
    { id: '5', title: 'Gig economy workers have no safety net or career progression path', description: 'Platform-based gig work has created workers who lack healthcare, pension, sick pay, and career development — trapped in permanent economic precarity.', evidence: 'UK ONS: 4.4 million gig workers. Most earn below minimum wage after expenses.', proposed_solution: 'Introduce portable benefits — contributions that follow the worker.', category: 'Economy', impact: 'Estimated 435 million gig workers globally as of 2025.' },
    { id: '6', title: 'Smartphone addiction is rewiring adolescent brain development', description: 'Excessive smartphone use during critical developmental years is correlated with increased anxiety, reduced attention span, and disrupted sleep patterns in teenagers.', evidence: 'Journal of Child Psychology 2023: teens averaging 7+ hours screen time show 40% higher anxiety markers.', proposed_solution: 'Implement device-level cognitive limits for developmental ages.', category: 'Social', impact: 'Affects 1 billion+ adolescents globally.' }
  ]

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user?.id || 'guest')
      
      const isDemoId = ['1','2','3','4','5','6'].includes(id as string)
      if (isDemoId) {
        setProblem(DEMO_PROBLEMS.find(p => p.id === id))
        setLoading(false)
      } else {
        if (!session) {
          router.push('/login')
          return
        }
        await fetchProblem(session.user.id)
      }
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
      if (userId === 'guest' || ['1','2','3','4','5','6'].includes(id as string)) {
        // Demo mode submission
        setTimeout(() => {
          setSubmitting(false)
          setShowSuccess(true)
        }, 1500)
        return
      }

      const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5
      // ... rest of the real submission logic
      
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
        const totalAvg = allReviews.reduce((acc: number, r: any) => {
          const rAvg = (r.clarity_score + r.feasibility_score + r.evidence_score + r.innovation_score + r.realism_score) / 5
          return acc + rAvg
        }, 0) / allReviews.length

        await supabase.from('problems').update({
          avg_score: totalAvg,
          review_count: allReviews.length
        }).eq('id', id)
      }

      // 3. Update User GRS & Streak
      const { data: profile } = await supabase.from('users').select('grs_score, streak, last_active').eq('id', userId).single()
      
      // Streak Logic
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const lastActive = profile?.last_active
      
      let newStreak = 1
      if (lastActive === yesterday) {
        newStreak = (profile?.streak || 0) + 1
      } else if (lastActive === today) {
        newStreak = profile?.streak || 1
      }

      const newScore = (profile?.grs_score || 0) + 50
      await supabase.from('users').update({ 
        grs_score: newScore,
        streak: newStreak,
        last_active: today
      }).eq('id', userId)
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

      {showSuccess && (
        <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-md w-full bg-[#050a14] border border-[#0ea5e9]/30 rounded-3xl p-12 text-center shadow-[0_0_100px_rgba(14,165,233,0.2)]">
            <div className="w-20 h-20 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center text-[#0ea5e9] mx-auto mb-8 border border-[#0ea5e9]/20">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MERIT RECORDED</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">Your review has been structured. Connect the database to save your contribution to the global record.</p>
            <button 
              onClick={() => router.push('/feed')}
              className="w-full py-4 bg-[#0ea5e9] text-black rounded-xl font-bold"
            >
              Back to Feed
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
