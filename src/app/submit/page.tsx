'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDemo } from '@/context/DemoStore'

function SubmitContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const parentId = searchParams.get('parent')
  const { actions, refresh } = useDemo()
  
  const [tab, setTab] = useState<'paste' | 'manual'>('paste')
  const [raw, setRaw] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' | 'info' } | null>(null)
  const [parentProblem, setParentProblem] = useState<any>(null)
  
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    evidence: '', 
    proposed_solution: '', 
    category: 'Technology',
    source_url: ''
  })

  useEffect(() => {
    if (parentId) {
      actions.fetchProblemById(parentId).then(setParentProblem)
    }
  }, [parentId])

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const structureAI = async () => {
    if (!raw.trim()) return
    setLoading(true)
    
    try {
      // Check for URL
      const urlMatch = raw.match(/https?:\/\/[^\s]+/g);
      const source_url = urlMatch ? urlMatch[0] : '';

      const structured = await actions.structureInput(raw)
      setForm({ ...structured, source_url })
      setTab('manual')
      showToast('AI analysis successful.', 'success')
    } catch (err) {
      showToast('AI structuring unavailable. Please fill fields manually.', 'error')
      setForm(prev => ({ ...prev, description: raw }))
      setTab('manual')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
        showToast('Title and description are required.', 'error')
        return
    }
    setLoading(true)
    try {
      await actions.submitProblem({
        ...form,
        parent_id: parentId
      })
      showToast('+120 GRS earned', 'success')
      await refresh()
      setTimeout(() => router.push('/feed'), 1500)
    } catch (err) {
      showToast('Submission failed. Check network.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white py-24 px-6 md:px-[10vw]">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 rounded-full border shadow-2xl animate-in zoom-in slide-in-from-top-4 duration-300 flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-[#0ea5e9]/10 border-[#0ea5e9]/40 text-[#0ea5e9]' :
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-500' :
          'bg-white/10 border-white/20 text-white'
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-[#0ea5e9] animate-pulse' : toast.type === 'error' ? 'bg-red-500' : 'bg-white'}`} />
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {parentProblem && (
          <div className="mb-12 p-6 bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-2xl flex items-center justify-between group animate-fade-in">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9]">
                <span className="text-xs font-mono font-bold tracking-tighter">EVL</span>
               </div>
               <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1">Evolving Solution for</div>
                  <div className="text-sm font-bold font-serif" style={{ fontFamily: "'Instrument Serif', serif" }}>{parentProblem.title}</div>
               </div>
            </div>
            <span className="text-[10px] font-mono text-[#0ea5e9] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">PARENT_ID: {parentProblem.id.slice(0,8)}</span>
          </div>
        )}

        <div className="mb-16">
          <div className="text-[10px] font-mono text-[#0ea5e9] tracking-[0.3em] uppercase mb-4 opacity-70 italic">// INTELLIGENCE INPUT</div>
          <h1 className="text-5xl md:text-7xl font-serif leading-none mb-6 italic" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Submit a <span className="text-white opacity-40">Problem</span>.
          </h1>
          <p className="text-slate-500 text-lg max-w-xl font-light">Structure your thinking. Every contribution is blindly reviewed and ranked based on merit and evidence.</p>
        </div>

        <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl mb-12 w-fit">
          {(['paste', 'manual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                tab === t ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-slate-500 hover:text-slate-300'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {t === 'paste' ? 'Paste Anything' : 'Structured Form'}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
          {tab === 'paste' ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="relative">
                  <textarea
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                    placeholder="Drop a YouTube link, IG post, article URL, or raw opinion..."
                    className="w-full min-h-[320px] bg-[#050505] border border-white/10 rounded-2xl p-8 text-xl font-light focus:outline-none focus:border-[#0ea5e9]/40 transition-all resize-none placeholder:text-slate-800"
                  />
                  <div className="absolute bottom-6 left-8 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
                    <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Neural Structuring Active</span>
                  </div>
               </div>
               <button
                  onClick={structureAI}
                  disabled={loading || !raw.trim()}
                  className="w-full py-6 bg-[#0ea5e9] text-black rounded-2xl font-bold text-sm tracking-[0.2em] uppercase hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-slate-800 disabled:text-slate-500"
               >
                  {loading ? 'Analyzing Input...' : 'Extract Problem Nodes →'}
               </button>
            </div>
          ) : (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 block italic">// TITLE</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="Core problem statement"
                        className="w-full bg-transparent border-b border-white/10 py-3 text-2xl font-serif focus:outline-none focus:border-[#0ea5e9] transition-all"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 block italic">// DESCRIPTION</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Detailed explanation and context..."
                        rows={4}
                        className="w-full bg-[#050505] border border-white/5 rounded-xl p-4 text-sm font-light focus:outline-none focus:border-[#0ea5e9]/30 transition-all resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 block italic">// EVIDENCE_SOURCE</label>
                      <input
                        type="text"
                        value={form.source_url}
                        onChange={(e) => setForm(f => ({ ...f, source_url: e.target.value }))}
                        placeholder="URL or Citation"
                        className="w-full bg-transparent border-b border-white/10 py-3 text-sm font-mono focus:outline-none focus:border-[#0ea5e9] transition-all text-[#0ea5e9]"
                      />
                    </div>
                    <div>
                       <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 block italic">// CLASSIFICATION</label>
                       <select
                          value={form.category}
                          onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full bg-[#050505] border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0ea5e9]/30 transition-all cursor-pointer appearance-none"
                        >
                          {['Technology', 'Education', 'Environment', 'Health', 'Economy', 'Social', 'Other'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                    </div>
                  </div>
               </div>
               
               <div className="pt-8 border-t border-white/5">
                 <button
                    onClick={handleManualSubmit}
                    disabled={loading || !form.title.trim()}
                    className="w-full py-6 bg-white text-black rounded-2xl font-bold text-sm tracking-[0.2em] uppercase hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Transmitting Data...' : 'Submit to Network Core'}
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function Submit() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono text-slate-500">BOOTING_SUBMIT_INTERFACE...</div>}>
      <SubmitContent />
    </Suspense>
  )
}
