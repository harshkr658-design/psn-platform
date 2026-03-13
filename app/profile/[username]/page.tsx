'use client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const DEMO_PROFILE = {
  username: 'iron-falcon',
  display_name: 'Iron Falcon',
  tier: 'CONTRIBUTOR',
  grs: 340,
  mrs: 4.2,
  streak: 5,
  joined: 'January 2026',
  problems_submitted: 3,
  reviews_given: 8,
  total_reach: 47,
  badges: [
    { label: 'Early Adopter', color: '#f59e0b', icon: '◈' },
    { label: 'First Review', color: '#0ea5e9', icon: '◈' },
    { label: 'Problem Solver', color: '#a855f7', icon: '◈' },
    { label: 'Consistent Thinker', color: '#3b82f6', icon: '◈' }
  ],
  problems: [
    { id: '1', title: 'Social media algorithms optimizing for outrage and division', category: 'Technology', upvotes: 47, avg_score: 4.3 },
    { id: '3', title: 'Urban air pollution disproportionately affects low-income communities', category: 'Environment', upvotes: 29, avg_score: 4.6 },
    { id: '6', title: 'Smartphone addiction is rewiring adolescent brain development', category: 'Social', upvotes: 55, avg_score: 4.2 },
  ]
}

export default function Profile() {
  const router = useRouter()
  const { username } = useParams()

  // Only demo for 'iron-falcon'
  if (username !== 'iron-falcon') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>IDENTITY NOT FOUND</h1>
        <p className="text-slate-500 mb-8">Node '{username}' has not yet been indexed in the merit network.</p>
        <button onClick={() => router.push('/leaderboard')} className="text-[#0ea5e9] font-mono font-bold">RETURN TO MERIT NODE</button>
      </div>
    )
  }

  const p = DEMO_PROFILE

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-[#050a14] border border-white/5 rounded-3xl p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9]/5 blur-3xl rounded-full" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold text-[#0ea5e9] tracking-[0.3em] uppercase leading-none italic">Verified Operator</span>
                <span className="text-[10px] font-bold bg-[#0ea5e9] text-black px-2 py-0.5 rounded leading-none">{p.tier}</span>
              </div>
              <h1 className="text-6xl font-black mb-2 tracking-tight italic" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
                {p.display_name.toUpperCase()}
              </h1>
              <p className="font-mono text-slate-500 text-xs tracking-widest uppercase">Member Since // {p.joined}</p>
            </div>
            
            <div className="flex gap-12 border-l border-white/10 pl-12">
              {[
                { label: 'GLOBAL MERIT', value: p.grs, color: '#0ea5e9' },
                { label: 'ACCURACY', value: p.mrs, color: '#f59e0b' },
                { label: 'STREAK', value: p.streak + 'd', color: '#ef4444' }
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">{s.label}</div>
                  <div className="text-3xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif", color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-1">
            {[
              { label: 'Problems Submited', value: p.problems_submitted },
              { label: 'Reviews Given', value: p.reviews_given },
              { label: 'Total Reach', value: p.total_reach }
            ].map(s => (
              <div key={s.label} className="bg-black/50 p-6 text-center">
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar: Badges */}
          <div className="md:col-span-1 space-y-8">
            <div className="bg-[#050a14] border border-white/5 rounded-3xl p-8">
              <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-6 uppercase leading-none italic">// MERIT BADGES</h3>
              <div className="flex flex-wrap gap-2">
                {p.badges.map(b => (
                  <div 
                    key={b.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 text-[10px] font-bold bg-white/5 hover:border-[#0ea5e9]/30 transition-all cursor-default"
                    style={{ color: b.color }}
                  >
                    <span>{b.icon}</span>
                    <span className="uppercase tracking-widest">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#050a14] border border-white/5 rounded-3xl p-8">
              <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-6 uppercase leading-none italic">// NETWORK STATUS</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Uptime</span>
                  <span className="text-[#22c55e]">99.8%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Connections</span>
                  <span>14 Allied Nodes</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Protocol</span>
                  <span className="font-mono">UPX-2.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main: Problems */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mb-6 uppercase leading-none italic px-4">// SUBMITTED MISSIONS</h3>
            <div className="space-y-4">
              {p.problems.map(problem => (
                <Link 
                  key={problem.id} 
                  href={`/problem/${problem.id}`}
                  className="block bg-[#050a14] border border-white/5 rounded-2xl p-6 hover:border-[#0ea5e9]/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-bold bg-white/5 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest">{problem.category}</span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#0ea5e9]">SCORE: {problem.avg_score}</div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-4 tracking-tight group-hover:text-[#0ea5e9] transition-all" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>
                    {problem.title.toUpperCase()}
                  </h4>
                  <div className="flex gap-4 items-center">
                    <div className="text-[10px] font-mono text-slate-500">▲ {problem.upvotes} UPVOTES</div>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">View Analysis →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
