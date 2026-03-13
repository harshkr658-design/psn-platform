'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ problems: 0, reviews: 0, upvotes: 0, mrs: 0 })
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const uid = session.user.id
      
      try {
        // 1. Fetch User Profile
        const { data: profile } = await supabase.from('users').select('*').eq('id', uid).single()
        setUser(profile)

        // 2. Fetch Stats
        const [problemsRes, reviewsRes, upvotesRes, mrsRes] = await Promise.all([
          supabase.from('problems').select('id', { count: 'exact' }).eq('author_id', uid),
          supabase.from('reviews').select('id', { count: 'exact' }).eq('reviewer_id', uid),
          supabase.from('problems').select('upvotes').eq('author_id', uid),
          supabase.from('mrs_scores').select('accuracy_score').eq('user_id', uid).single()
        ])

        const totalUpvotes = (upvotesRes.data || []).reduce((acc: number, p: any) => acc + (p.upvotes || 0), 0)

        setStats({
          problems: problemsRes.count || 0,
          reviews: reviewsRes.count || 0,
          upvotes: totalUpvotes,
          mrs: mrsRes.data?.accuracy_score || 0
        })

        // 3. Fetch Activity
        const { data: logs } = await supabase.from('grs_log').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5)
        setActivity(logs || [])

      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getTier = (score: number) => {
    if (score >= 1500) return { name: 'Expert', color: '#f59e0b' }
    if (score >= 500) return { name: 'Reviewer', color: '#a855f7' }
    if (score >= 100) return { name: 'Contributor', color: '#0ea5e9' }
    return { name: 'Observer', color: '#94a3b8' }
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#0ea5e9]">Syncing Command Center...</div>

  const tier = getTier(user?.grs_score || 0)

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">{user?.display_name || 'Anonymous Vector'}</h1>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ color: tier.color }}>
                {tier.name}
              </span>
            </div>
            <p className="text-slate-500 text-sm">Operator UID: <span className="font-mono text-[10px]">{user?.id}</span></p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="text-3xl font-black text-[#0ea5e9] tracking-tighter">{user?.grs_score || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase font-black leading-tight">Total<br/>GRS Score</div>
            </div>
            <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="text-3xl font-black text-orange-500 tracking-tighter flex items-center gap-1">
                {user?.streak || 0} <span className="text-xl">🔥</span>
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-black leading-tight">Day<br/>Streak</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Submissions', value: stats.problems, suffix: '', icon: 'M12 4v16m8-8H4' },
            { label: 'Blind Reviews', value: stats.reviews, suffix: '', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Upvotes Earned', value: stats.upvotes, suffix: '', icon: 'M5 15l7-7 7 7' },
            { label: 'MRS Accuracy', value: stats.mrs.toFixed(1), suffix: '%', icon: 'M9 12l2 2 4-4' },
          ].map((s, i) => (
            <div key={i} className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-[#0ea5e9]/30 transition-all">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{s.label}</div>
              <div className="text-4xl font-black italic tracking-tighter mb-2">{s.value}{s.suffix}</div>
              <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Impact Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-[#0ea5e9]/10 to-transparent border border-[#0ea5e9]/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
                Network Impact
              </h3>
              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed max-w-xl">
                  Your ideas have filtered through the network and reached <span className="text-white font-bold">{stats.upvotes * 12 + 5} people</span>. 
                  You've inspired <span className="text-white font-bold">{Math.floor(stats.problems * 0.8)} primary evolutions</span> and contributed to the collective logic of the platform.
                </p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0ea5e9]" style={{ width: `${Math.min(100, (user?.grs_score / 1500) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                  Next Tier: {getTier((user?.grs_score || 0) + 100).name} ({Math.max(0, 1500 - (user?.grs_score || 0))} pts required)
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-bold mb-6 px-2 italic uppercase tracking-tight">Recent Activity Log</h3>
              <div className="space-y-4">
                {activity.map((log, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                    <div>
                      <div className="text-sm font-bold tracking-tight">{log.action_type}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{new Date(log.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-sm font-black text-[#0ea5e9]">+{log.points} GRS</div>
                  </div>
                ))}
                {activity.length === 0 && <p className="text-slate-600 italic px-2">No activity recorded for this vector yet.</p>}
              </div>
            </div>
          </div>

          {/* Sidebar / Mini Stats */}
          <div className="space-y-8">
            <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Synergy Breakdown</h4>
              <div className="space-y-4">
                {[
                  { label: 'Logical Accuracy', val: '92%' },
                  { label: 'Community Trust', val: 'High' },
                  { label: 'Mission Focus', val: 'Direct' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] text-slate-400">{item.label}</span>
                    <span className="text-[11px] font-mono text-[#0ea5e9]">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-[#0ea5e9] text-black rounded-3xl group cursor-pointer hover:scale-[1.02] transition-all overflow-hidden relative">
              <h4 className="text-xl font-black italic tracking-tighter mb-2">NEW MISSION DETECTED</h4>
              <p className="text-xs font-bold opacity-80 mb-6">A high-yield problem needs your review.</p>
              <a href="/feed" className="inline-block bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Acknowledge</a>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-black/10 rounded-full group-hover:scale-150 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
