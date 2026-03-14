'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockApi, DemoState, User, Problem } from '@/lib/mockApi'

interface DemoContextType {
  state: DemoState
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  actions: typeof mockApi
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshState = async () => {
    const s = mockApi.getState()
    setState(s)
    setLoading(false)
  }

  useEffect(() => {
    mockApi.init()
    refreshState()
  }, [])

  const value = {
    state: state!,
    user: state?.users.find(u => u.id === 'u1') || null, // Default to demo user
    loading,
    refresh: refreshState,
    actions: mockApi
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-[#0ea5e9]">BOOTING DEMO NETWORK...</div>

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}
