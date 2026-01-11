'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { FileText, Package, Users, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  landListings: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  products: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  activeAgents: number
}

export default function AdminDashboard() {
  const { user, agent, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    landListings: { total: 0, pending: 0, approved: 0, rejected: 0 },
    products: { total: 0, pending: 0, approved: 0, rejected: 0 },
    activeAgents: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (agent) {
      fetchStats()
    }
  }, [agent])

  const fetchStats = async () => {
    try {
      // Fetch land listings
      const { data: landData, error: landError } = await supabase
        .from('land_listings')
        .select('status')

      if (landError) throw landError

      // Fetch products
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('status')

      if (productError) throw productError

      // Fetch active agents
      const { data: agentData, error: agentError } = await supabase
        .from('field_agents')
        .select('id')
        .eq('status', 'active')

      if (agentError) throw agentError

      const landStats = {
        total: landData?.length || 0,
        pending: landData?.filter(l => l.status === 'submitted').length || 0,
        approved: landData?.filter(l => l.status === 'approved').length || 0,
        rejected: landData?.filter(l => l.status === 'rejected').length || 0
      }

      const productStats = {
        total: productData?.length || 0,
        pending: productData?.filter(p => p.status === 'submitted').length || 0,
        approved: productData?.filter(p => p.status === 'approved').length || 0,
        rejected: productData?.filter(p => p.status === 'rejected').length || 0
      }

      setStats({
        landListings: landStats,
        products: productStats,
        activeAgents: agentData?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jawudi-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-jawudi-navy to-deep-navy text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Review and manage field agent submissions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Land Listings Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Land Listings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-gray-900">{stats.landListings.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                </span>
                <span className="text-lg font-semibold text-orange-600">{stats.landListings.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved
                </span>
                <span className="text-lg font-semibold text-green-600">{stats.landListings.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejected
                </span>
                <span className="text-lg font-semibold text-red-600">{stats.landListings.rejected}</span>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-emerald-500">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-emerald-500" />
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-gray-900">{stats.products.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                </span>
                <span className="text-lg font-semibold text-orange-600">{stats.products.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved
                </span>
                <span className="text-lg font-semibold text-green-600">{stats.products.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejected
                </span>
                <span className="text-lg font-semibold text-red-600">{stats.products.rejected}</span>
              </div>
            </div>
          </div>

          {/* Active Agents Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Field Agents</h3>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-gray-900 mb-2">{stats.activeAgents}</div>
              <p className="text-gray-600">Active agents</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/land-listings?status=submitted"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group border-l-4 border-orange-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition">
                      Review Land Listings
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {stats.landListings.pending} submission{stats.landListings.pending !== 1 ? 's' : ''} waiting for review
                  </p>
                </div>
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {stats.landListings.pending}
                </div>
              </div>
            </Link>

            <Link
              href="/admin/products?status=submitted"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group border-l-4 border-emerald-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition">
                      Review Products
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {stats.products.pending} submission{stats.products.pending !== 1 ? 's' : ''} waiting for review
                  </p>
                </div>
                <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {stats.products.pending}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* All Submissions Links */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">View All Submissions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/land-listings"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <FileText className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">All Land Listings</p>
                <p className="text-sm text-gray-600">{stats.landListings.total} total</p>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition"
            >
              <Package className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="font-semibold text-gray-900">All Products</p>
                <p className="text-sm text-gray-600">{stats.products.total} total</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
