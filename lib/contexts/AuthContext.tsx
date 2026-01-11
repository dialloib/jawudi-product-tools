'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface FieldAgent {
  id: string
  user_id: string
  full_name: string
  role: 'agent' | 'admin' | 'supervisor'
  status: string
}

interface AuthContextType {
  user: User | null
  agent: FieldAgent | null
  isLoading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [agent, setAgent] = useState<FieldAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchOrCreateAgentProfile(session.user)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchOrCreateAgentProfile(session.user)
      } else {
        setAgent(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchOrCreateAgentProfile = async (user: User) => {
    // Check if agent profile exists
    const { data, error } = await supabase
      .from('field_agents')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: newAgent, error: createError } = await supabase
        .from('field_agents')
        .insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email || 'Field Agent',
          phone_number: user.phone || null,
          role: 'agent',
          status: 'active'
        })
        .select()
        .single()

      if (!createError && newAgent) {
        setAgent(newAgent)
      }
    } else if (data) {
      setAgent(data)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Login error:', error)
      alert('Failed to sign in. Please try again.')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAgent(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        agent,
        isLoading,
        isAdmin: agent?.role === 'admin',
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
