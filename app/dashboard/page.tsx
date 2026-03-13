'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ problems: 0, reviews: 0, upvotes: 0, evolutions: 0 })
  const [activity, setActivity] = useState<any[]>([])
  const [mrs, setMrs] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      try {
        const [
          { data: userData },
          { count: problemCount },
          { count: reviewCount },
          { data: upvoteData },
          { data: activityData },
          { data: mrsData }
        ] = await Promise.all([
          supabase.from('users').select('*').eq('id', session.user.id).single(),
          supabase.from('problems').select('*', { count: 'exact', head: true }).eq('author_id', session.user.id),
          supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('reviewer_id', session.user.id),
          supabase.from('problems').select('upvotes').eq('author_id', session.user.id),
          supabase.from('grs_log').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(8),
          supabase.from('mrs_scores').select('*').eq('user_id', session.user.id).single()
        ])

        setUser(userData)
        const totalUpvotes = upvoteData?.reduce((sum: number, p: any) => sum + (p.upvotes || 0), 0) || 0
        setStats({ problems: problemCount || 0, reviews: reviewCount || 0, upvotes: totalUpvotes, evolutions: 0 })
        setActivity(activityData || [])
        setMrs(mrsData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getTier = (grs: number) => {
    if (grs >= 1500) return { label: 'EXPERT', color: '#f59e0b' }
    if (grs >= 500) return { label: 'REVIEWER', color: '#a855f7' }
    if (grs >= 100) return { label: 'CONTRIBUTOR', color: '#0ea5e9' }
    return { label: 'OBSERVER', color: '#64748b' }
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",color:'#0ea5e9',fontSize:'13px',letterSpacing:'0.1em'}}>
      LOADING OPERATOR DATA...
    </div>
  )

  const tier = getTier(user?.grs_score || 0)

  return (
    <div style={{minHeight:'100vh',background:'#000',color:'#fff',fontFamily:"'DM Sans',sans-serif",padding:'100px 5vw 48px'}}>
      
      {/* Top status bar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'48px',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#334155',letterSpacing:'0.2em',marginBottom:'4px'}}>OPERATOR COMMAND CENTER</div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'48px',letterSpacing:'0.05em',margin:0,background:'linear-gradient(135deg,#fff,#94a3b8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            {user?.display_name || 'ANONYMOUS'}
          </h1>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#334155',letterSpacing:'0.1em'}}>
            {time.toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'}).toUpperCase()}
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'24px',color:'#0ea5e9',letterSpacing:'0.1em'}}>
            {time.toLocaleTimeString('en-US',{hour12:false})}
          </div>
        </div>
      </div>

      {/* Tier + streak banner */}
      <div style={{display:'flex',gap:'12px',marginBottom:'32px',flexWrap:'wrap'}}>
        <div style={{background:`${tier.color}15`,border:`1px solid ${tier.color}40`,borderRadius:'4px',padding:'10px 20px',fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color:tier.color,letterSpacing:'0.15em'}}>
          ◈ {tier.label}
        </div>
        <div style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.3)',borderRadius:'4px',padding:'10px 20px',fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color:'#fb923c',letterSpacing:'0.15em'}}>
          🔥 {user?.streak || 0} DAY STREAK
        </div>
        <div style={{background:'rgba(14,165,233,0.05)',border:'1px solid #1e293b',borderRadius:'4px',padding:'10px 20px',fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color:'#0ea5e9',letterSpacing:'0.15em'}}>
          ◎ {user?.grs_score || 0} GRS
        </div>
      </div>

      {/* Main stats grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'2px',marginBottom:'32px'}}>
        {[
          {label:'PROBLEMS SUBMITTED',value:stats.problems,sub:'contributions to the network',color:'#0ea5e9'},
          {label:'REVIEWS GIVEN',value:stats.reviews,sub:'blind evaluations completed',color:'#22c55e'},
          {label:'UPVOTES RECEIVED',value:stats.upvotes,sub:'community endorsements',color:'#a855f7'},
          {label:'MRS ACCURACY',value:mrs ? `${(mrs.accuracy_score * 100).toFixed(0)}%` : 'N/A',sub:`${mrs?.review_count || 0} reviews calibrated`,color:'#f59e0b'},
        ].map(s => (
          <div key={s.label} style={{background:'#050a14',border:'1px solid #0f172a',padding:'32px 24px',position:'relative',overflow:'hidden',minHeight:'200px'}}>
            <div style={{position:'absolute',bottom:'-16px',right:'-8px',fontFamily:"'Bebas Neue',sans-serif",fontSize:'80px',color:`${s.color}06`,lineHeight:1}}>{s.value}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#334155',letterSpacing:'0.15em',marginBottom:'12px'}}>{s.label}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'52px',color:s.color,lineHeight:1,marginBottom:'8px'}}>{s.value}</div>
            <div style={{fontSize:'12px',color:'#334155',position:'relative',zIndex:1}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two column: Impact + Activity */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'2px',marginBottom:'32px'}}>
        
        {/* Impact card */}
        <div style={{background:'#050a14',border:'1px solid #0f172a',padding:'32px 24px'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'24px'}}>// YOUR IMPACT</div>
          <p style={{fontSize:'16px',color:'#94a3b8',lineHeight:'1.8',margin:'0 0 24px'}}>
            Your ideas have reached <span style={{color:'#0ea5e9',fontWeight:'600'}}>{stats.upvotes + stats.reviews}</span> people and inspired <span style={{color:'#0ea5e9',fontWeight:'600'}}>{stats.evolutions}</span> evolutions.
          </p>
          <div style={{height:'1px',background:'#0f172a',margin:'24px 0'}} />
          <div style={{display:'flex',gap:'24px'}}>
            <a href="/submit" style={{flex:1,background:'#0ea5e9',color:'#000',padding:'12px',borderRadius:'4px',textAlign:'center',textDecoration:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',fontWeight:'700',letterSpacing:'0.08em'}}>+ SUBMIT</a>
            <a href="/feed" style={{flex:1,border:'1px solid #1e293b',color:'#94a3b8',padding:'12px',borderRadius:'4px',textAlign:'center',textDecoration:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',letterSpacing:'0.08em'}}>FEED →</a>
          </div>
        </div>

        {/* Activity feed */}
        <div style={{background:'#050a14',border:'1px solid #0f172a',padding:'32px 24px'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'24px'}}>// RECENT ACTIVITY</div>
          {activity.length === 0 && <p style={{color:'#334155',fontSize:'13px'}}>No activity yet. Submit a problem to start.</p>}
          <div style={{maxHeight:'240px',overflowY:'auto'}}>
            {activity.map((a, i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #0a0f1a'}}>
                <span style={{fontSize:'13px',color:'#64748b'}}>{a.action_type}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color: a.points >= 0 ? '#22c55e':'#ef4444'}}>+{a.points} GRS</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRS Progress bar */}
      <div style={{background:'#050a14',border:'1px solid #0f172a',padding:'32px 24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#0ea5e9',letterSpacing:'0.2em'}}>// GRS PROGRESSION</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#64748b'}}>NEXT: {tier.label === 'OBSERVER' ? 'CONTRIBUTOR @ 100' : tier.label === 'CONTRIBUTOR' ? 'REVIEWER @ 500' : tier.label === 'REVIEWER' ? 'EXPERT @ 1500' : 'MAX TIER'}</div>
        </div>
        <div style={{background:'#0a0f1a',borderRadius:'2px',height:'6px',overflow:'hidden'}}>
          <div style={{height:'100%',background:`linear-gradient(90deg,${tier.color},${tier.color}99)`,width:`${Math.min(100,(user?.grs_score||0)/1500*100)}%`,transition:'width 1s ease',boxShadow:`0 0 12px ${tier.color}`}} />
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#334155'}}>
          <span>0</span><span>100</span><span>500</span><span>1500</span>
        </div>
      </div>

    </div>
  )
}
