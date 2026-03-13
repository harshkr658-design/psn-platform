'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Submit() {
  const router = useRouter()
  const [tab, setTab] = useState<'paste'|'manual'>('paste')
  const [raw, setRaw] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title:'', description:'', evidence:'', proposed_solution:'', category:'Other', impact:'' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function structure() {
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-3-5-sonnet-20240620', max_tokens:1000,
          messages:[{role:'user',content:`Structure this into a problem post. Return ONLY valid JSON with keys: title, description, evidence, proposed_solution, category (one of: Environment Social Technology Health Education Economy Politics Personal Other), impact. Raw input: ${raw}`}]
        })
      })
      const data = await res.json()
      const structured = JSON.parse(data.content[0].text)
      setForm(structured)
      setTab('manual')
    } catch {
      setForm(f => ({...f, description: raw.slice(0,300)}))
      setTab('manual')
    } finally { setLoading(false) }
  }

  async function submit() {
    if (!supabase) {
      alert('Supabase not configured.')
      return
    }
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const url = raw.startsWith('http') ? raw.split(' ')[0] : null
    await supabase.from('problems').insert({
      ...form, raw_input: raw, source_url: url,
      author_id: session?.user?.id || null,
      status:'open', upvotes:0, avg_score:0, review_count:0
    })
    if(session?.user?.id) {
      await supabase.from('grs_log').insert({ user_id: session.user.id, action_type:'Problem submitted', points:120 })
      await supabase.from('users').update({ grs_score: 120 }).eq('id', session.user.id)
    }
    router.push('/feed')
  }

  if (!mounted) {
    return (
      <main style={{minHeight:'100vh',background:'#000',color:'#fff',padding:'40px 20px',maxWidth:'700px',margin:'0 auto'}}>
        <h1 style={{fontSize:'32px',fontWeight:'700',marginBottom:'32px'}}>Submit a Problem</h1>
        <p style={{color:'#94a3b8'}}>Loading...</p>
      </main>
    )
  }

  return (
    <main style={{minHeight:'100vh',background:'#000',color:'#fff',padding:'40px 20px',maxWidth:'700px',margin:'0 auto'}}>
      <h1 style={{fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Submit a Problem</h1>
      <p style={{color:'#94a3b8',marginBottom:'32px'}}>Any problem, any size. AI will help you structure it.</p>
      <div style={{display:'flex',gap:'8px',marginBottom:'32px'}}>
        {(['paste','manual'] as const).map(t => <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?'#0ea5e9':'#1e293b',color:tab===t?'#000':'#fff',border:'none',padding:'10px 20px',borderRadius:'8px',cursor:'pointer',fontWeight:'600',textTransform:'capitalize'}}>{t === 'paste' ? 'Paste anything' : 'Write manually'}</button>)}
      </div>
      {tab === 'paste' && (
        <div>
          <textarea value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Paste a YouTube link, Instagram post, tweet, article URL, or just write what is bothering you..." style={{width:'100%',minHeight:'200px',background:'#0f172a',border:'1px solid #1e293b',borderRadius:'12px',padding:'16px',color:'#fff',fontSize:'16px',resize:'vertical',boxSizing:'border-box'}} />
          <button onClick={structure} disabled={loading||!raw.trim()} style={{marginTop:'16px',background:'#0ea5e9',color:'#000',border:'none',padding:'14px 28px',borderRadius:'8px',fontWeight:'700',fontSize:'16px',cursor:'pointer',width:'100%'}}>{loading ? 'AI is structuring...' : 'Structure this →'}</button>
        </div>
      )}
      {tab === 'manual' && (
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {[
            {key:'title',label:'Problem title',placeholder:'One clear sentence stating the problem'},
            {key:'description',label:'Description',placeholder:'2-3 sentences explaining it neutrally'},
            {key:'evidence',label:'Evidence / context',placeholder:'Facts, data, or links that support this'},
            {key:'proposed_solution',label:'Proposed solution',placeholder:'Your idea, or leave as Open for solutions'},
            {key:'impact',label:'Expected impact',placeholder:'Who is affected and how'},
          ].map(f => (
            <div key={f.key}>
              <label style={{fontSize:'13px',color:'#94a3b8',display:'block',marginBottom:'6px'}}>{f.label}</label>
              <textarea value={(form as any)[f.key]} onChange={e=>setForm(fm=>({...fm,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{width:'100%',minHeight:'80px',background:'#0f172a',border:'1px solid #1e293b',borderRadius:'8px',padding:'12px',color:'#fff',fontSize:'14px',resize:'vertical',boxSizing:'border-box'}} />
            </div>
          ))}
          <div>
            <label style={{fontSize:'13px',color:'#94a3b8',display:'block',marginBottom:'6px'}}>Category</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{width:'100%',background:'#0f172a',border:'1px solid #1e293b',borderRadius:'8px',padding:'12px',color:'#fff',fontSize:'14px'}}>
              {['Environment','Social','Technology','Health','Education','Economy','Politics','Personal','Other'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={submit} disabled={loading||!form.title.trim()} style={{background:'#0ea5e9',color:'#000',border:'none',padding:'14px',borderRadius:'8px',fontWeight:'700',fontSize:'16px',cursor:'pointer'}}>{loading ? 'Submitting...' : 'Submit Problem →'}</button>
        </div>
      )}
    </main>
  )
}
