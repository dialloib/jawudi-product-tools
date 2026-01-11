'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { FileText, ArrowLeft, Filter, MapPin, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'

interface LandListing {
  id: string
  title: string
  region: string
  city: string
  land_size_value: number
  land_size_unit: string
  total_price: number
  currency_code: string
  status: string
  created_at: string
  agent_id: string
  field_agents?: {
    full_name: string
  }
}

export default function LandListingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams?.get('status') || 'all'

  const [listings, setListings] = useState<LandListing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(statusFilter)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    fetchListings()
  }, [selectedStatus])

  const fetchListings = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('land_listings')
        .select(`
          *,
          field_agents(full_name)
        `)
        .order('created_at', { ascending: false })

      // Apply status filter
      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus)
      }

      const { data, error } = await query

      if (error) throw error

      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'GNF' ? 'GNF' : 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jawudi-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-jawudi-navy to-deep-navy text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-white hover:text-jawudi-mint transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Land Listings</h1>
              <p className="text-gray-300">{listings.length} total listings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'submitted', 'approved', 'rejected', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedStatus === status
                    ? 'bg-jawudi-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all'
                ? 'No land listings have been submitted yet.'
                : `No listings with status "${selectedStatus}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/admin/land-listings/${listing.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        listing.status
                      )}`}
                    >
                      {listing.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatDate(listing.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                    {listing.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">
                      {listing.city}, {listing.region}
                    </span>
                  </div>

                  {/* Size */}
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">{listing.land_size_value}</span> {listing.land_size_unit}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                    <DollarSign className="w-5 h-5" />
                    {formatCurrency(listing.total_price, listing.currency_code)}
                  </div>

                  {/* Agent Info */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Submitted by{' '}
                      <span className="font-semibold text-gray-700">
                        {listing.field_agents?.full_name || 'Unknown Agent'}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
