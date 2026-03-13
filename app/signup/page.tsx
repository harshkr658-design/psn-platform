'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0ea5e9]/5 via-transparent to-transparent">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter mb-2">NETWORK INITIALIZATION</h1>
          <p className="text-slate-500 text-sm">Join the decentralised meritocracy.</p>
        </div>

        <form onSubmit={handleSignup} className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center">
              {error.toUpperCase()}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-[10px] font-bold text-center">
              ACCOUNT INITIALIZED. REDIRECTING...
            </div>
          )}

          <div className="space-y-4 mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
            <h3 className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />
              Privacy Protocol 1.0
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon registration, a random **Codename** (e.g., "Silver Falcon") will be assigned to your vector. This identity will be used for all blind reviews to protect the meritocracy from bias.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Vector Identity (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0ea5e9]/50 transition-all placeholder:text-slate-800"
              placeholder="operator@psn.net"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Security Key (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0ea5e9]/50 transition-all placeholder:text-slate-800"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            className="w-full py-4 bg-[#0ea5e9] text-black rounded-xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register Vector'}
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-600">
              Already initialized? <a href="/login" className="text-[#0ea5e9] font-bold hover:underline">Access Node</a>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
