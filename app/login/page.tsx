'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Chrome, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { signInWithGoogle, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jawudi-navy to-blue-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jawudi-navy to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-jawudi-mint rounded-full flex items-center justify-center mx-auto mb-4">
            <Chrome className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Jawudi Field Agent</h1>
          <p className="text-gray-600 mt-2">Sign in to collect field data</p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-3"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to use this tool for authorized field data collection.
        </p>
      </div>
    </div>
  )
}
