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
  const [showSuccess, setShowSuccess] = useState(false)
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

  async function structure() {
    if (!raw.trim()) return
    setLoading(true)
    
    // Simulate high-fidelity AI Analysis
    await new Promise(r => setTimeout(r, 3000))
    
    setForm({
      title: 'Pervasive Social Media Polarization',
      description: 'The current structure of engagement-based algorithms is systematically eroding public trust and increasing societal fragmentation by prioritizing outrage over shared reality.',
      evidence: 'Platform X internal reports indicate engagement increases by 34% for negative emotional triggers.',
      proposed_solution: 'Implement an "Epistemic Merit" layer that decouples visibility from engagement and integrates it with factual verification.',
      impact: 'Restoration of public discourse, reduction in radicalization rates, and improved civic health.',
      category: 'Technology'
    })
    
    setTab('manual')
    setLoading(false)
  }

  async function submit() {
    if (!form.title.trim()) return
    setLoading(true)
    
    // Simulate network transmission
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setShowSuccess(true)
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

        <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', letterSpacing: '0.05em' }}>SUBMIT A PROBLEM</h1>
        <p className="text-slate-400 mb-10" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.05em', color: '#64748b' }}>// INITIALIZE NEW PROBLEM DATA NODE</p>

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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>{f.label}</label>
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

        {showSuccess && (
          <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="max-w-md w-full bg-[#050a14] border border-[#0ea5e9]/30 rounded-3xl p-12 text-center shadow-[0_0_100px_rgba(14,165,233,0.2)]">
              <div className="w-20 h-20 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center text-[#0ea5e9] mx-auto mb-8 border border-[#0ea5e9]/20">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PROBLEM STRUCTURED</h2>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">Your mission has been processed and is ready for the network. Join the network to publish it globally.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => router.push('/signup')}
                  className="w-full py-4 bg-[#0ea5e9] text-black rounded-xl font-bold"
                >
                  JOIN THE NETWORK
                </button>
                <button 
                  onClick={() => router.push('/feed')}
                  className="w-full py-4 bg-transparent border border-white/10 text-white rounded-xl font-bold text-xs"
                >
                  BACK TO FEED
                </button>
              </div>
            </div>
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
