'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, MapPin, DollarSign, Calendar, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface LandListing {
  id: string
  title: string
  description: string
  region: string
  city: string
  neighborhood: string
  land_size_value: number
  land_size_unit: string
  total_price: number
  currency_code: string
  price_per_unit: number
  status: string
  land_type: string
  topography: string
  soil_type: string
  access_road: boolean
  utilities_available: string[]
  zoning: string
  title_status: string
  coordinates_lat: number
  coordinates_lng: number
  boundary_description: string
  photos: string[]
  created_at: string
  agent_id: string
  field_agents?: {
    full_name: string
    email: string
    phone_number: string
  }
}

export default function LandListingReviewPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id as string

  const [listing, setListing] = useState<LandListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (listingId) {
      fetchListing()
    }
  }, [listingId])

  const fetchListing = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('land_listings')
        .select(`
          *,
          field_agents(full_name, email, phone_number)
        `)
        .eq('id', listingId)
        .single()

      if (error) throw error

      setListing(data)
    } catch (error) {
      console.error('Error fetching listing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!listing) return

    try {
      setUpdating(true)
      const { error } = await supabase
        .from('land_listings')
        .update({ status: 'approved' })
        .eq('id', listing.id)

      if (error) throw error

      alert('Listing approved successfully!')
      router.push('/admin/land-listings')
    } catch (error) {
      console.error('Error approving listing:', error)
      alert('Failed to approve listing')
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!listing) return

    try {
      setUpdating(true)
      const { error } = await supabase
        .from('land_listings')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason || null
        })
        .eq('id', listing.id)

      if (error) throw error

      alert('Listing rejected successfully!')
      router.push('/admin/land-listings')
    } catch (error) {
      console.error('Error rejecting listing:', error)
      alert('Failed to reject listing')
    } finally {
      setUpdating(false)
      setShowRejectModal(false)
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jawudi-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
          <Link href="/admin/land-listings" className="text-blue-600 hover:underline">
            Back to listings
          </Link>
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
            href="/admin/land-listings"
            className="inline-flex items-center gap-2 text-white hover:text-jawudi-mint transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Land Listings
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Submitted on {formatDate(listing.created_at)}</span>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                listing.status
              )}`}
            >
              {listing.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Listing Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos */}
            {listing.photos && listing.photos.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.photos.map((photo, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700">
                      {listing.neighborhood}, {listing.city}, {listing.region}
                    </p>
                  </div>
                </div>
                {listing.coordinates_lat && listing.coordinates_lng && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Coordinates</p>
                      <p className="text-gray-700">
                        {listing.coordinates_lat}, {listing.coordinates_lng}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Land Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Land Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {listing.land_size_value} {listing.land_size_unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Land Type</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.land_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Topography</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.topography}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Soil Type</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.soil_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Access Road</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {listing.access_road ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zoning</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.zoning}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Title Status</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.title_status}</p>
                </div>
                {listing.utilities_available && listing.utilities_available.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2">Utilities Available</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.utilities_available.map((utility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {utility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {listing.boundary_description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Boundary Description</p>
                  <p className="text-gray-700">{listing.boundary_description}</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Price</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(listing.total_price, listing.currency_code)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Price per {listing.land_size_unit}</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(listing.price_per_unit, listing.currency_code)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Agent Info & Actions */}
          <div className="space-y-6">
            {/* Agent Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submitted By</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {listing.field_agents?.full_name || 'Unknown Agent'}
                    </p>
                    <p className="text-sm text-gray-600">Field Agent</p>
                  </div>
                </div>
                {listing.field_agents?.email && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Email:</span> {listing.field_agents.email}
                  </div>
                )}
                {listing.field_agents?.phone_number && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Phone:</span> {listing.field_agents.phone_number}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {listing.status === 'submitted' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Review Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {updating ? 'Approving...' : 'Approve Listing'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Listing
                  </button>
                </div>
              </div>
            )}

            {listing.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Approved</p>
                    <p className="text-sm">This listing has been approved</p>
                  </div>
                </div>
              </div>
            )}

            {listing.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 text-red-700 mb-2">
                  <XCircle className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Rejected</p>
                    <p className="text-sm">This listing has been rejected</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Listing</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this listing? You can optionally provide a reason:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
