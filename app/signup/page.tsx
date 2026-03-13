'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [codename, setCodename] = useState('Iron Falcon')
  const [loading, setLoading] = useState(false)

  const codenames = ['Iron Falcon', 'Dark Meridian', 'Swift Cipher', 'Blue Vertex', 'Silver Nexus', 'Silent Orbit']
  
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setCodename(codenames[i % codenames.length])
      i++
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: '400px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '42px', letterSpacing: '0.15em', color: '#fff', textDecoration: 'none' }}>
            UPRAXIS<span style={{ color: '#0ea5e9' }}>.</span>
          </Link>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748b', letterSpacing: '0.3em', marginTop: '12px' }}>INITIALIZE PRESENCE</div>
        </div>

        <div style={{ background: '#050a14', border: '1px solid #0f172a', padding: '40px', borderRadius: '4px' }}>
          
          <div style={{ marginBottom: '32px', textAlign: 'center', background: 'rgba(14,165,233,0.05)', padding: '20px', borderRadius: '4px', border: '1px dashed #0ea5e940' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#0ea5e9', marginBottom: '8px' }}>ASSIGNED CODENAME (PREVIEW)</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '24px', color: '#fff', letterSpacing: '0.1em' }} className="animate-pulse">{codename.toUpperCase()}</div>
            <p style={{ fontSize: '10px', color: '#64748b', marginTop: '12px' }}>Your reviews always appear anonymous.</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#334155', marginBottom: '8px', letterSpacing: '0.1em' }}>IDENTITY / EMAIL</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="you@presence.net"
              style={{ width: '100%', background: '#000', border: '1px solid #1e293b', padding: '12px 16px', color: '#fff', fontSize: '14px', borderRadius: '4px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#334155', marginBottom: '8px', letterSpacing: '0.1em' }}>SECURE ACCESS KEY</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: '#000', border: '1px solid #1e293b', padding: '12px 16px', color: '#fff', fontSize: '14px', borderRadius: '4px', outline: 'none' }}
            />
          </div>

          <button 
            onClick={() => { setLoading(true); setTimeout(() => router.push('/dashboard'), 1500); }}
            style={{ width: '100%', background: '#0ea5e9', color: '#000', padding: '14px', borderRadius: '4px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '0.1em' }}
          >
            {loading ? 'INDEXING IDENTITY...' : 'CREATE PRESENCE'}
          </button>

          <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #0f172a', paddingTop: '32px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Already indexed?</p>
            <Link href="/login" style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Uplink Existing Node</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
