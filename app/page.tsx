'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, FileText, Package, LogOut, LogIn, Shield } from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function HomePage() {
  const { user, agent, signOut, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jawudi-navy to-deep-navy text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jawudi-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jawudi-navy to-deep-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-jawudi-mint rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="w-10 h-10 text-jawudi-navy" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Jawudi Field Agent</h1>
          <p className="text-xl text-gray-300">Data Collection Tool</p>

          {agent && (
            <div className="mt-4 inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
              <span className="text-sm">Welcome, <span className="font-semibold">{agent.full_name}</span></span>
              <button
                onClick={signOut}
                className="text-red-400 hover:text-red-300 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          <Link
            href="/collect/land"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition group"
          >
            <FileText className="w-12 h-12 text-jawudi-mint mb-4 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold mb-2">Land Catalog</h2>
            <p className="text-gray-300">
              Collect land and property information including location, size, utilities, and owner details.
            </p>
          </Link>

          <Link
            href="/collect/product"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition group"
          >
            <Package className="w-12 h-12 text-jawudi-gold mb-4 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold mb-2">Product Collection</h2>
            <p className="text-gray-300">
              Catalog building materials and collect supplier network information.
            </p>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <Link
            href="/admin"
            className="bg-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 hover:bg-purple-600/30 transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-purple-400 group-hover:scale-110 transition" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
                <p className="text-gray-300">
                  Review and manage field agent submissions
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Powered by Jawudi • Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
