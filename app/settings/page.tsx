'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setEmail(session.user.email || '')
        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        setUser(data)
        setDisplayName(data?.display_name || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('users').update({ display_name: displayName }).eq('id', user.id)
    if (!error) {
      setUser({ ...user, display_name: displayName })
      alert('Profile updated successfully')
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",color:'#0ea5e9',fontSize:'13px'}}>
      FETCHING OPERATOR PROFILE...
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#000',color:'#fff',fontFamily:"'DM Sans',sans-serif",padding:'100px 5vw 48px'}}>
      <div style={{maxWidth:'600px',margin:'0 auto'}}>
        <div style={{marginBottom:'48px'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'12px'}}>// NODE CONFIGURATION</div>
            <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'64px',letterSpacing:'0.05em',margin:0}}>SETTINGS</h1>
        </div>

        <div style={{background:'#050a14',border:'1px solid #0f172a',padding:'40px',borderRadius:'4px'}}>
          <div style={{marginBottom:'32px'}}>
            <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#334155',marginBottom:'12px'}}>OPERATOR CODENAME</label>
            <input 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)}
              style={{
                width:'100%',
                background:'#000',
                border:'1px solid #1e293b',
                padding:'12px 16px',
                color:'#fff',
                fontSize:'16px',
                fontFamily:"'DM Sans',sans-serif",
                borderRadius:'4px',
                outline:'none'
              }}
            />
            <p style={{fontSize:'12px',color:'#64748b',marginTop:'12px',fontStyle:'italic'}}>Note: Your reviews always appear anonymous regardless of your display name.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'32px'}}>
            <div>
              <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#334155',marginBottom:'8px'}}>EMAIL IDENTITY</label>
              <div style={{fontSize:'14px',color:'#fff'}}>{email}</div>
            </div>
            <div>
              <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#334155',marginBottom:'8px'}}>CURRENT TIER</label>
              <div style={{fontSize:'14px',color:'#fff',fontWeight:600}}>{user?.tier?.toUpperCase()}</div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'40px'}}>
            <div>
              <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#334155',marginBottom:'8px'}}>GLOBAL MERIT (GRS)</label>
              <div style={{fontSize:'20px',fontFamily:"'Bebas Neue',sans-serif",color:'#0ea5e9'}}>{user?.grs_score || 0}</div>
            </div>
            <div>
              <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#334155',marginBottom:'8px'}}>ACCURACY RATING (MRS)</label>
              <div style={{fontSize:'20px',fontFamily:"'Bebas Neue',sans-serif",color:'#f59e0b'}}>{user?.mrs_score || '0.0'}</div>
            </div>
          </div>

          <button 
            onClick={save}
            disabled={saving}
            style={{
              width:'100%',
              background:'#0ea5e9',
              color:'#000',
              border:'none',
              padding:'16px',
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:'12px',
              fontWeight:700,
              borderRadius:'4px',
              cursor:'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'UPDATING NODE...' : 'SAVE CONFIGURATION'}
          </button>
        </div>
      </div>
    </div>
  )
}
