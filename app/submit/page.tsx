'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function SubmitContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const parentId = searchParams.get('parent')
  
  const [tab, setTab] = useState<'paste' | 'manual'>('paste')
  const [raw, setRaw] = useState('')
  const [loading, setLoading] = useState(false)
  const [parentTitle, setParentTitle] = useState<string | null>(null)
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    evidence: '', 
    proposed_solution: '', 
    category: 'Other', 
    impact: '' 
  })

  useEffect(() => {
    if (parentId) {
      async function fetchParent() {
        const { data } = await supabase.from('problems').select('title').eq('id', parentId).single()
        if (data) setParentTitle(data.title)
      }
      fetchParent()
    }
  }, [parentId])

  async function structure() {
    if (!raw.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setForm(data)
      setTab('manual')
    } catch (err) {
      console.error(err)
      setForm(f => ({ ...f, description: raw.slice(0, 500) }))
      setTab('manual')
      alert('AI unavailable — please fill manually')
    } finally {
      setLoading(false)
    }
  }

  async function submit() {
    if (!supabase) return
    if (!form.title.trim()) return
    
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      
      // Insert problem
      const { data: problem, error: pError } = await supabase.from('problems').insert({
        ...form,
        raw_input: raw,
        author_id: user?.id || null,
        parent_id: parentId || null,
        status: 'open',
        upvotes: 0,
        avg_score: 0,
        review_count: 0
      }).select().single()

      if (pError) throw pError

      // If logged in, award points
      if (user) {
        await supabase.from('grs_log').insert({
          user_id: user.id,
          action_type: 'Problem submitted',
          points: 120
        })
        
        // Fetch current score and update
        const { data: profile } = await supabase.from('users').select('grs_score').eq('id', user.id).single()
        const newScore = (profile?.grs_score || 0) + 120
        await supabase.from('users').update({ grs_score: newScore }).eq('id', user.id)
      }

      router.push('/feed')
    } catch (err) {
      console.error(err)
      alert('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {parentTitle && (
          <div className="mb-8 p-4 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 rounded-xl flex items-center gap-3 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
            <span className="text-[#0ea5e9] font-medium text-sm">Evolving: <span className="text-white ml-1">{parentTitle}</span></span>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-2 tracking-tight">Submit a Problem</h1>
        <p className="text-slate-400 mb-10">Any problem, any size. AI will help you structure it for the network.</p>

        <div className="flex p-1 bg-white/5 rounded-xl mb-8 w-fit">
          {(['paste', 'manual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? 'bg-[#0ea5e9] text-black shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'paste' ? 'Paste Anything' : 'Manual Form'}
            </button>
          ))}
        </div>

        {tab === 'paste' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder="Paste a YouTube link, Instagram post, tweet, article URL, or just write what is bothering you..."
                className="w-full min-h-[300px] bg-[#0f172a] border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-[#0ea5e9]/50 transition-colors resize-none placeholder:text-slate-600"
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 uppercase tracking-widest pointer-events-none">
                AI Processing Enabled
              </div>
            </div>
            <button
              onClick={structure}
              disabled={loading || !raw.trim()}
              className="w-full py-5 bg-[#0ea5e9] text-black rounded-2xl font-black text-lg tracking-tight hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  AI is structuring...
                </>
              ) : (
                'Structure with AI →'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6">
              {[
                { key: 'title', label: 'Problem Title', placeholder: 'One clear sentence stating the problem' },
                { key: 'description', label: 'Description', placeholder: '2-3 sentences explaining it neutrally', rows: 3 },
                { key: 'evidence', label: 'Evidence / Context', placeholder: 'Facts, data, or links that support this', rows: 2 },
                { key: 'proposed_solution', label: 'Proposed Solution', placeholder: 'Your idea, or leave as "Open for solutions"', rows: 2 },
                { key: 'impact', label: 'Expected Impact', placeholder: 'Who is affected and how', rows: 2 },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">{f.label}</label>
                  <textarea
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((fm) => ({ ...fm, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    rows={f.rows || 1}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#0ea5e9]/50 transition-colors resize-none placeholder:text-slate-700"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#0ea5e9]/50 transition-colors appearance-none cursor-pointer"
                >
                  {['Environment', 'Social', 'Technology', 'Health', 'Education', 'Economy', 'Politics', 'Personal', 'Other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading || !form.title.trim()}
              className="w-full py-5 bg-[#0ea5e9] text-black rounded-2xl font-black text-lg tracking-tight hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit to Network →'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Submit() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-slate-500">Loading Submit...</div>}>
      <SubmitContent />
    </Suspense>
  )
}
