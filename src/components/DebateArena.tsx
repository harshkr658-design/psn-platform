'use client'

import React, { useState, useEffect } from 'react'
import { mockApi, Problem } from '@/lib/mockApi'
import { useDemo } from '@/context/DemoStore'

interface DebateArenaProps {
  problemId: string
}

export default function DebateArena({ problemId }: DebateArenaProps) {
  const { state, user, actions, refresh } = useDemo()
  const [mode, setMode] = useState<'rapid' | 'structured'>('rapid')
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState<any[]>([])
  const [consensus, setConsensus] = useState(42)
  const [synthesis, setSynthesis] = useState<string | null>(null)

  useEffect(() => {
    actions.fetchDebate(problemId).then(setEntries)
  }, [problemId, state.debate_entries])

  const submitEntry = async () => {
    if (!content.trim() || !user) return
    if (mode === 'rapid' && content.length > 280) return

    await actions.submitDebateEntry({
      problem_id: problemId,
      user_id: user.id,
      content,
      mode,
      type: 'claim',
      created_at: new Date().toISOString()
    })
    setContent('')
    refresh()
  }

  const triggerSynthesis = () => {
    setSynthesis("Based on the prevailing claims regarding algorithmic opacity and engagement-driven polarization, the network recommends an 'Epistemic Merit' layer. This system would utilize decentralized verification nodes to weigh content accuracy against raw engagement metrics, effectively neutralizing the 'outrage premium'.")
    setConsensus(85)
  }

  const promoteToProblem = async () => {
    if (!synthesis) return
    await actions.submitProblem({
      title: `Synthesis: ${synthesis.slice(0, 40)}...`,
      description: synthesis,
      parent_id: problemId,
      category: 'Technology'
    })
    alert('Synthesis promoted to a new problem branch! +200 GRS awarded to contributors.')
    setSynthesis(null)
    refresh()
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex gap-4 p-1.5 bg-white/[0.03] border border-white/5 rounded-xl">
          {['rapid', 'structured'].map(m => (
            <button 
              key={m} 
              onClick={() => setMode(m as any)}
              className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${mode === m ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {m} round
            </button>
          ))}
        </div>
        <div className="text-right">
           <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1">Network Consensus</div>
           <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-1000" style={{ width: `${consensus}%` }} />
              </div>
              <span className="text-sm font-bold text-[#0ea5e9]">{consensus}%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INPUT STACK */}
        <div className="space-y-6">
           <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest italic">// DELIBERATE_INPUT</label>
                {mode === 'rapid' && <span className={`text-[10px] font-mono ${content.length > 280 ? 'text-red-500' : 'text-slate-600'}`}>{content.length}/280</span>}
              </div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={mode === 'rapid' ? "State your claim quickly (max 280 chars)..." : "Structure: [CLAIM] -> [EVIDENCE] -> [COUNTER]"}
                className="w-full h-40 bg-black/40 border border-white/5 rounded-xl p-5 text-sm font-light focus:outline-none focus:border-[#0ea5e9]/30 transition-all resize-none mb-6"
              />
              <button 
                onClick={submitEntry}
                disabled={!content.trim() || !user || (mode === 'rapid' && content.length > 280)}
                className="w-full py-4 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#0ea5e9] rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#0ea5e9]/20 transition-all disabled:opacity-30"
              >
                Transmit Deliberation
              </button>
           </div>

           {/* Synthesis Bot Preview */}
           {consensus > 60 && !synthesis && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Synthesis Engine Ready</span>
                </div>
                <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed italic">The network has reached a high-consensus vector. The Synthesis Bot can now aggregate prevailing logic into a formal evolution branch.</p>
                <button 
                  onClick={triggerSynthesis}
                  className="w-full py-3 bg-emerald-500 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Generate Synthesis Draft
                </button>
              </div>
           )}

           {synthesis && (
             <div className="bg-white/[0.03] border border-[#0ea5e9]/40 rounded-2xl p-8 animate-in zoom-in duration-500 shadow-2xl shadow-[#0ea5e9]/10">
                <h4 className="text-[10px] font-mono text-[#0ea5e9] uppercase tracking-widest mb-6 italic">// DRAFT_SYNTHESIS_v1.0</h4>
                <p className="text-sm font-light leading-relaxed mb-8 italic text-slate-200">"{synthesis}"</p>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => setSynthesis(null)}
                     className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10"
                   >
                     Discard
                   </button>
                   <button 
                     onClick={promoteToProblem}
                     className="py-3 bg-[#0ea5e9] text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#0ea5e9]/20"
                   >
                     Promote to Branch
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* FEED STACK */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
           <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-4 italic">// ACTIVE_DELIBERATIONS</h3>
           {entries.length === 0 && <p className="text-xs text-slate-600 font-light italic">No deliberative nodes initialized for this problem sector yet.</p>}
           {entries.reverse().map((e, idx) => (
             <div key={idx} className="bg-white/[0.015] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold text-slate-400">
                        OP
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 tracking-tighter uppercase">{e.mode} delib</span>
                   </div>
                   <span className="text-[10px] font-mono text-slate-700">{new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{e.content}</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.02]">
                   <button className="text-[9px] font-mono font-bold text-slate-600 hover:text-[#0ea5e9] uppercase tracking-widest transition-colors">Endorse</button>
                   <button className="text-[9px] font-mono font-bold text-slate-600 hover:text-red-500 uppercase tracking-widest transition-colors">Contradict</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
