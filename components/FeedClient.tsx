'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const categories = ['All', 'Environment', 'Social', 'Technology', 'Health', 'Education', 'Economy', 'Politics', 'Personal', 'Other']

const categoryColors: Record<string, string> = {
  Environment: '#22c55e', Social: '#a855f7', Technology: '#3b82f6',
  Health: '#ef4444', Education: '#14b8a6', Economy: '#f59e0b',
  Politics: '#f97316', Personal: '#94a3b8', Other: '#64748b'
}

const DEMO_PROBLEMS = [
  {
    id: '1',
    title: 'Social media algorithms optimise for outrage rather than accuracy',
    description: 'Major platforms use engagement-based ranking that amplifies emotionally charged content over factually accurate content, eroding shared reality.',
    evidence: 'MIT study found false news spreads 6x faster than true news. Facebook internal research showed algorithm changes boosted anger reactions.',
    category: 'Technology',
    upvotes: 47,
    avg_score: 4.3,
    review_count: 12,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    source_url: null,
    parent_id: null
  },
  {
    id: '2',
    title: 'Students memorise answers rather than developing critical thinking',
    description: 'Education systems globally optimise for standardised test scores, rewarding memorisation over reasoning, questioning, and creation.',
    evidence: 'PISA 2022 data shows students significantly underperform in open-ended reasoning vs recall tasks globally.',
    category: 'Education',
    upvotes: 38,
    avg_score: 4.1,
    review_count: 9,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    source_url: null,
    parent_id: null
  },
  {
    id: '3',
    title: 'Urban air pollution disproportionately affects low-income communities',
    description: 'Industrial facilities and highways are systematically located near low-income areas, exposing those with least political power to highest environmental health risks.',
    evidence: 'EPA data shows communities of colour are 1.5x more likely to live near industrial polluters. WHO: 7 million premature deaths annually from air pollution.',
    category: 'Environment',
    upvotes: 29,
    avg_score: 4.6,
    review_count: 7,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    source_url: null,
    parent_id: null
  },
  {
    id: '4',
    title: 'Mental health support is inaccessible to most people who need it',
    description: 'The global mental health system is severely under-resourced, leaving the majority without access to professional support due to cost, availability, and stigma.',
    evidence: 'WHO: 75% of people with mental disorders in low-income countries receive no treatment. US therapy costs $150-300 per session without insurance.',
    category: 'Health',
    upvotes: 61,
    avg_score: 4.7,
    review_count: 18,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    source_url: null,
    parent_id: null
  },
  {
    id: '5',
    title: 'Gig economy workers have no safety net or career progression path',
    description: 'Platform-based gig work has created workers who lack healthcare, pension, sick pay, and career development — trapped in permanent economic precarity.',
    evidence: 'UK ONS: 4.4 million gig workers. Most earn below minimum wage after expenses. Zero access to employer pension contributions.',
    category: 'Economy',
    upvotes: 22,
    avg_score: 3.9,
    review_count: 6,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    source_url: null,
    parent_id: null
  },
  {
    id: '6',
    title: 'Smartphone addiction is rewiring adolescent brain development',
    description: 'Excessive smartphone use during critical developmental years is correlated with increased anxiety, reduced attention span, and disrupted sleep patterns in teenagers.',
    evidence: 'Journal of Child Psychology 2023: teens averaging 7+ hours screen time show 40% higher anxiety markers. Sleep disruption affects 70% of adolescents.',
    category: 'Social',
    upvotes: 55,
    avg_score: 4.2,
    review_count: 14,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    source_url: null,
    parent_id: null
  }
]

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
        if (upvotes) setUserUpvotes(new Set(upvotes.map((u: any) => u.problem_id)))
      }
      await load()
    }
    init()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('problems').select('*')
      if (error || !data || data.length === 0) {
        setProblems(DEMO_PROBLEMS)
      } else {
        setProblems(data)
      }
    } catch (e) {
      console.error('Supabase fetch failed, using demo data:', e)
      setProblems(DEMO_PROBLEMS)
    } finally {
      setTimeout(() => setLoading(false), 800) // Ensure smooth transition
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
  const childrenMap = filtered.filter(p => p.parent_id).reduce((acc: Record<string, any[]>, p: any) => {
    if (!acc[p.parent_id]) acc[p.parent_id] = []
    acc[p.parent_id].push(p)
    return acc
  }, {})

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
        {(p.avg_score || 0) >= 4 && (p.review_count || 0) >= 5 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-500 border border-purple-500/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ✨ High Merit
          </span>
        )}
        {(p.upvotes || 0) >= 10 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            🔥 Gaining Traction
          </span>
        )}
        {(p.upvotes || 0) >= 50 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ✅ Community Verified
          </span>
        )}
        {childrenMap[p.id]?.length >= 3 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-500 border border-cyan-500/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ◈ Evolving
          </span>
        )}
      </div>

      <Link href={`/problem/${p.id}`} className="no-underline group">
        <h2 className="text-xl font-bold mb-3 leading-tight group-hover:text-[#0ea5e9] transition-colors">{p.title}</h2>
      </Link>
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
            <span className="text-[#0ea5e9] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.avg_score ? p.avg_score.toFixed(1) : '—'}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-tighter" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Merit Score</span>
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
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MISSION BOARD</h1>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.05em' }}>RANKED BY COLLECTIVE MERIT AND MATHEMATICAL RECENCY</p>
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
