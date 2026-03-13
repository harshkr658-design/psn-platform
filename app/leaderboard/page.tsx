'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // 100% UI MVP persistent demo mode
      setLeaders([
        { id: '1', display_name: 'Iron Falcon', weeklyGrs: 840, streak: 12, tier: 'Expert' },
        { id: '2', display_name: 'Dark Meridian', weeklyGrs: 720, streak: 8, tier: 'Reviewer' },
        { id: '3', display_name: 'Swift Cipher', weeklyGrs: 650, streak: 5, tier: 'Contributor' },
        { id: '4', display_name: 'Blue Vertex', weeklyGrs: 490, streak: 3, tier: 'Contributor' },
        { id: '5', display_name: 'Silver Nexus', weeklyGrs: 380, streak: 7, tier: 'Contributor' },
        { id: '6', display_name: 'Bright Pulse', weeklyGrs: 290, streak: 2, tier: 'Contributor' },
        { id: '7', display_name: 'Silent Orbit', weeklyGrs: 210, streak: 4, tier: 'Observer' },
        { id: '8', display_name: 'Bold Forge', weeklyGrs: 180, streak: 1, tier: 'Observer' },
        { id: '9', display_name: 'Sharp Prism', weeklyGrs: 120, streak: 3, tier: 'Observer' },
        { id: '10', display_name: 'Calm Vector', weeklyGrs: 90, streak: 2, tier: 'Observer' }
      ])
      setCurrentUser({ id: '1', display_name: 'Iron Falcon', weeklyGrs: 840, streak: 12, tier: 'Expert' })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",color:'#0ea5e9',fontSize:'13px'}}>
      SCANNING GLOBAL MERIT...
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#000',color:'#fff',fontFamily:"'DM Sans',sans-serif",padding:'100px 5vw 48px'}}>
      <div style={{maxWidth:'1000px',margin:'0 auto'}}>
        <div style={{marginBottom:'48px'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'12px'}}>// GLOBAL OPERATOR RANKINGS</div>
            <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'64px',letterSpacing:'0.05em',margin:0}}>LEADERBOARD</h1>
            <p style={{color:'#64748b',fontSize:'14px',fontFamily:"'JetBrains Mono',monospace"}}>TOP 10 CONTRIBUTORS BY GRS WEIGHT (7-DAY WINDOW)</p>
        </div>

        <div style={{background:'#050a14',border:'1px solid #0f172a',borderRadius:'4px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #0f172a',textAlign:'left'}}>
                <th style={{padding:'20px',fontFamily:"'JetBrains Mono',monospace",color:'#334155',fontSize:'11px'}}>RANK</th>
                <th style={{padding:'20px',fontFamily:"'JetBrains Mono',monospace",color:'#334155',fontSize:'11px'}}>OPERATOR / CODENAME</th>
                <th style={{padding:'20px',fontFamily:"'JetBrains Mono',monospace",color:'#334155',fontSize:'11px'}}>GRS (WEEKLY)</th>
                <th style={{padding:'20px',fontFamily:"'JetBrains Mono',monospace",color:'#334155',fontSize:'11px'}}>STREAK</th>
                <th style={{padding:'20px',fontFamily:"'JetBrains Mono',monospace",color:'#334155',fontSize:'11px'}}>TIER</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l, i) => (
                <tr key={l.id} style={{
                  borderBottom:'1px solid #0f172a',
                  background: currentUser?.id === l.id ? 'rgba(14,165,233,0.05)' : 'transparent',
                  color: currentUser?.id === l.id ? '#0ea5e9' : '#fff'
                }}>
                  <td style={{padding:'20px',fontFamily:"'Bebas Neue',sans-serif",fontSize:'24px'}}>{i + 1}</td>
                  <td style={{padding:'20px',fontWeight:600}}>{l.display_name || 'ANONYMOUS'}</td>
                  <td style={{padding:'20px',fontFamily:"'JetBrains Mono',monospace",color:'#0ea5e9'}}>+{l.weeklyGrs}</td>
                  <td style={{padding:'20px'}}>{l.streak || 0} 🔥</td>
                  <td style={{padding:'20px'}}>
                    <span style={{
                      fontSize:'10px',
                      padding:'3px 8px',
                      borderRadius:'2px',
                      border:`1px solid ${l.tier === 'Expert' ? '#f59e0b' : '#334155'}`,
                      color: l.tier === 'Expert' ? '#f59e0b' : '#64748b',
                      fontFamily:"'JetBrains Mono',monospace"
                    }}>{l.tier?.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
              {currentUser && !leaders.find(l => l.id === currentUser.id) && (
                <tr style={{
                  borderBottom:'1px solid #0f172a',
                  background: 'rgba(14,165,233,0.1)',
                  color: '#0ea5e9'
                }}>
                  <td style={{padding:'20px',fontFamily:"'Bebas Neue',sans-serif",fontSize:'24px'}}>—</td>
                  <td style={{padding:'20px',fontWeight:600}}>{currentUser.display_name || 'YOU'} (Target Located)</td>
                  <td style={{padding:'20px',fontFamily:"'JetBrains Mono',monospace"}}>+{currentUser.weeklyGrs}</td>
                  <td style={{padding:'20px'}}>{currentUser.streak || 0} 🔥</td>
                  <td style={{padding:'20px'}}>
                    <span style={{
                      fontSize:'10px',
                      padding:'3px 8px',
                      borderRadius:'2px',
                      border:'1px solid #0ea5e9',
                      color: '#0ea5e9',
                      fontFamily:"'JetBrains Mono',monospace"
                    }}>{currentUser.tier?.toUpperCase()}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
