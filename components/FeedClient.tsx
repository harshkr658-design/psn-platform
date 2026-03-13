'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const categories = ['All', 'Environment', 'Social', 'Technology', 'Health', 'Education', 'Economy', 'Politics', 'Personal', 'Other']

const categoryColors: Record<string, string> = {
  Environment: '#22c55e', Social: '#a855f7', Technology: '#3b82f6',
  Health: '#ef4444', Education: '#14b8a6', Economy: '#f59e0b',
  Politics: '#f97316', Personal: '#94a3b8', Other: '#64748b'
}

export default function FeedClient() {
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('merit')
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        const { data: upvotes } = await supabase.from('upvotes_log').select('problem_id').eq('user_id', session.user.id)
        if (upvotes) setUserUpvotes(new Set(upvotes.map(u => u.problem_id)))
      }
      await load()
    }
    init()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await supabase.from('problems').select('*')
      setProblems(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function toggleUpvote(problemId: string, currentUpvotes: number) {
    if (!userId) {
      alert('Please login to upvote')
      return
    }

    const isUpvoted = userUpvotes.has(problemId)
    
    if (isUpvoted) {
      // Remove upvote
      await supabase.from('upvotes_log').delete().eq('user_id', userId).eq('problem_id', problemId)
      await supabase.from('problems').update({ upvotes: Math.max(0, currentUpvotes - 1) }).eq('id', problemId)
      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.delete(problemId)
        return next
      })
    } else {
      // Add upvote
      await supabase.from('upvotes_log').insert({ user_id: userId, problem_id: problemId })
      await supabase.from('problems').update({ upvotes: currentUpvotes + 1 }).eq('id', problemId)
      setUserUpvotes(prev => new Set(prev).add(problemId))
    }
    load() // Refresh
  }

  function calculateMerit(p: any) {
    const hoursSince = (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60)
    const recencyScore = 1 / (hoursSince + 1)
    return ((p.upvotes || 0) * 0.4) + ((p.avg_score || 0) * 0.4) + (recencyScore * 0.2)
  }

  const filtered = problems.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Group into threads
  const parents = filtered.filter(p => !p.parent_id)
  const childrenMap = filtered.filter(p => p.parent_id).reduce((acc, p) => {
    if (!acc[p.parent_id]) acc[p.parent_id] = []
    acc[p.parent_id].push(p)
    return acc
  }, {} as Record<string, any[]>)

  const sortedParents = [...parents].sort((a, b) => {
    if (sort === 'merit') return calculateMerit(b) - calculateMerit(a)
    if (sort === 'new') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return 0
  })

  const renderCard = (p: any, isChild = false) => (
    <div 
      key={p.id} 
      className={`group relative bg-[#0f172a] border border-white/5 rounded-2xl p-6 transition-all hover:border-[#0ea5e9]/30 ${isChild ? 'ml-8 mt-4 border-l-[#0ea5e9]/40' : 'mb-6'}`}
    >
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5" style={{ color: categoryColors[p.category] }}>
          {p.category}
        </span>
        {(p.upvotes || 0) >= 10 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-500 border border-orange-500/20">
            🔥 Trending
          </span>
        )}
        {(p.avg_score || 0) >= 4 && (p.review_count || 0) >= 3 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-500 border border-purple-500/20">
            ✨ High Merit
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold mb-3 leading-tight group-hover:text-[#0ea5e9] transition-colors">{p.title}</h2>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
      
      {p.source_url && (
        <a href={p.source_url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-[10px] text-slate-500 border border-white/5 hover:text-[#0ea5e9] transition-colors mb-4">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Source Reference
        </a>
      )}

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-white font-bold">{p.upvotes || 0}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Upvotes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold">{p.review_count || 0}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Reviews</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#0ea5e9] font-bold">{p.avg_score ? p.avg_score.toFixed(1) : '—'}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Merit Score</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleUpvote(p.id, p.upvotes || 0)}
            className={`p-2.5 rounded-xl transition-all border ${userUpvotes.has(p.id) ? 'bg-[#0ea5e9] border-[#0ea5e9] text-black shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'bg-white/5 border-white/10 text-white hover:border-[#0ea5e9]/50'}`}
          >
            <svg className="w-5 h-5" fill={userUpvotes.has(p.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
          </button>
          <a href={`/review/${p.id}`} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">Review</a>
          <a href={`/submit?parent=${p.id}`} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#0ea5e9] hover:bg-[#0ea5e9]/10 transition-all">Evolve</a>
        </div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic">MISSION BOARD</h1>
            <p className="text-slate-500 text-sm">Ranked by collective merit and mathematical recency.</p>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Filter problems..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#0ea5e9]/50 transition-all w-full md:w-64"
            />
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
              {(['merit', 'new'] as const).map(s => (
                <button 
                  key={s} 
                  onClick={() => setSort(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${sort === s ? 'bg-[#0ea5e9] text-black shadow-[0_0_10px_rgba(14,165,233,0.3)]' : 'text-slate-500 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar mask-fade-right">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setFilter(c)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border transition-all ${filter === c ? 'bg-[#0ea5e9] border-[#0ea5e9] text-black' : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-[#0ea5e9]/20 border-t-[#0ea5e9] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase tracking-widest">Scanning Network...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedParents.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl">
                <p className="text-slate-500 mb-6">No problems detected in this grid.</p>
                <a href="/submit" className="px-8 py-3 bg-[#0ea5e9] text-black rounded-xl font-bold hover:scale-105 transition-all inline-block">Initialize First Mission</a>
              </div>
            )}
            {sortedParents.map(parent => (
              <div key={parent.id}>
                {renderCard(parent)}
                {childrenMap[parent.id]?.map(child => renderCard(child, true))}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
