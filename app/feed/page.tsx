'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const categoryColors: Record<string,string> = {
  Environment:'#22c55e', Social:'#a855f7', Technology:'#3b82f6',
  Health:'#ef4444', Education:'#14b8a6', Economy:'#f59e0b',
  Politics:'#f97316', Personal:'#94a3b8', Other:'#64748b'
}

export default function Feed() {
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('top')
  const categories = ['All','Environment','Social','Technology','Health','Education','Economy','Politics','Personal','Other']

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('problems').select('*').order('created_at', { ascending: false })
      setProblems(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = problems.filter(p => filter === 'All' || p.category === filter)
  const sorted = [...filtered].sort((a,b) => {
    if(sort === 'top') return ((b.upvotes||0)*0.4 + (b.avg_score||0)*0.4) - ((a.upvotes||0)*0.4 + (a.avg_score||0)*0.4)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <main style={{minHeight:'100vh',background:'#000',color:'#fff',padding:'40px 20px',maxWidth:'800px',margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
        <h1 style={{fontSize:'32px',fontWeight:'700',margin:'0'}}>Feed</h1>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={()=>setSort('top')} style={{background:sort==='top'?'#0ea5e9':'#1e293b',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer'}}>Top</button>
          <button onClick={()=>setSort('new')} style={{background:sort==='new'?'#0ea5e9':'#1e293b',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer'}}>New</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'24px'}}>
        {categories.map(c => <button key={c} onClick={()=>setFilter(c)} style={{background:filter===c?'#0ea5e9':'#1e293b',color:'#fff',border:'none',padding:'6px 14px',borderRadius:'20px',cursor:'pointer',fontSize:'13px'}}>{c}</button>)}
      </div>
      {loading && <p style={{color:'#94a3b8'}}>Loading...</p>}
      {!loading && sorted.length === 0 && (
        <div style={{textAlign:'center',padding:'80px 0',color:'#94a3b8'}}>
          <p style={{fontSize:'18px',marginBottom:'16px'}}>No problems yet.</p>
          <a href="/submit" style={{background:'#0ea5e9',color:'#000',padding:'12px 24px',borderRadius:'8px',textDecoration:'none',fontWeight:'600'}}>Be the first to submit one</a>
        </div>
      )}
      {sorted.map(p => (
        <div key={p.id} style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
            <span style={{background:categoryColors[p.category]+'22',color:categoryColors[p.category],padding:'4px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'}}>{p.category || 'Other'}</span>
            {p.avg_score >= 4 && p.review_count >= 3 && <span style={{background:'#7c3aed22',color:'#a855f7',padding:'4px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'}}>High Merit</span>}
            {(p.upvotes||0) >= 10 && <span style={{background:'#15803d22',color:'#22c55e',padding:'4px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'}}>Trending</span>}
          </div>
          <h2 style={{fontSize:'18px',fontWeight:'600',margin:'0 0 8px',lineHeight:'1.3'}}>{p.title}</h2>
          <p style={{color:'#94a3b8',fontSize:'14px',margin:'0 0 16px',lineHeight:'1.5',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{p.description}</p>
          {p.source_url && <a href={p.source_url} target="_blank" rel="noopener noreferrer" style={{color:'#0ea5e9',fontSize:'12px',marginBottom:'16px',display:'block'}}>Source link</a>}
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <span style={{color:'#94a3b8',fontSize:'13px'}}>{p.upvotes||0} upvotes</span>
            <span style={{color:'#94a3b8',fontSize:'13px'}}>{p.review_count||0} reviews</span>
            <span style={{color:'#94a3b8',fontSize:'13px'}}>{p.avg_score ? p.avg_score.toFixed(1) : '—'} score</span>
            <div style={{marginLeft:'auto',display:'flex',gap:'8px'}}>
              <a href={`/review/${p.id}`} style={{background:'#1e293b',color:'#fff',padding:'6px 14px',borderRadius:'6px',textDecoration:'none',fontSize:'13px'}}>Review</a>
              <a href={`/submit?parent=${p.id}`} style={{background:'#1e293b',color:'#0ea5e9',padding:'6px 14px',borderRadius:'6px',textDecoration:'none',fontSize:'13px'}}>Evolve</a>
            </div>
          </div>
        </div>
      ))}
    </main>
  )
}
