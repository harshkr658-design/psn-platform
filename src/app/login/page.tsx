'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Background Ambience */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: '400px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '42px', letterSpacing: '0.15em', color: '#fff', textDecoration: 'none' }}>
            UPRAXIS<span style={{ color: '#0ea5e9' }}>.</span>
          </Link>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748b', letterSpacing: '0.3em', marginTop: '12px' }}>NODE AUTHENTICATION</div>
        </div>

        <div style={{ background: '#050a14', border: '1px solid #0f172a', padding: '40px', borderRadius: '4px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#334155', marginBottom: '8px', letterSpacing: '0.1em' }}>IDENTITY / EMAIL</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@upraxis.network"
              style={{ width: '100%', background: '#000', border: '1px solid #1e293b', padding: '12px 16px', color: '#fff', fontSize: '14px', borderRadius: '4px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#334155', marginBottom: '8px', letterSpacing: '0.1em' }}>ACCESS KEY / PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: '#000', border: '1px solid #1e293b', padding: '12px 16px', color: '#fff', fontSize: '14px', borderRadius: '4px', outline: 'none' }}
            />
          </div>

          <button 
            onClick={() => { setLoading(true); setTimeout(() => router.push('/dashboard'), 1000); }}
            style={{ width: '100%', background: '#0ea5e9', color: '#000', padding: '14px', borderRadius: '4px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '0.1em' }}
          >
            {loading ? 'OPENING NODE...' : 'INITIALIZE SESSION'}
          </button>

          <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #0f172a', paddingTop: '32px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>No uplink detected?</p>
            <Link href="/signup" style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Initialize New Presence</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/feed" style={{ fontSize: '11px', color: '#334155', textDecoration: 'none', letterSpacing: '0.1em', fontFamily: "'JetBrains Mono',monospace" }}>CONTINUE AS GUEST OPERATOR →</Link>
        </div>
      </div>
    </main>
  )
}
