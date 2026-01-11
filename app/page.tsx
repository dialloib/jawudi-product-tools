'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Package, Shield } from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { AppHeader } from '@/components/navigation/AppHeader'

export default function HomePage() {
  const { user, agent, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jawudi-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome message */}
          {agent && (
            <div className="bg-gradient-to-r from-jawudi-navy to-deep-navy text-white rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {agent.full_name}!</h2>
              <p className="text-gray-300">Ready to collect field data today</p>
            </div>
          )}

          {/* Quick Access section */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Access</h3>
            <p className="text-gray-600">Select a data collection tool to get started</p>
          </div>

          {/* Navigation cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Link
              href="/collect/land"
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-jawudi-mint transition group"
            >
              <FileText className="w-12 h-12 text-jawudi-mint mb-4 group-hover:scale-110 transition" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Land Catalog</h2>
              <p className="text-gray-600">
                Collect land and property information including location, size, utilities, and owner details.
              </p>
            </Link>

            <Link
              href="/collect/product"
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-emerald-500 transition group"
            >
              <Package className="w-12 h-12 text-emerald-500 mb-4 group-hover:scale-110 transition" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Product Collection</h2>
              <p className="text-gray-600">
                Catalog building materials and collect supplier network information.
              </p>
            </Link>
          </div>

          {/* Admin Dashboard */}
          <div>
            <Link
              href="/admin"
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-purple-500 transition group flex items-center gap-4"
            >
              <Shield className="w-12 h-12 text-purple-500 group-hover:scale-110 transition flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                <p className="text-gray-600">
                  Review and manage field agent submissions
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
