'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Package, DollarSign, Calendar, User, CheckCircle, XCircle, AlertCircle, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  product_name: string
  category: string
  brand: string
  description: string
  unit_measure: string
  quantity_available: number
  buy_price: number
  sell_price: number
  currency: string
  status: string
  availability_status: string
  barcode: string
  sku: string
  expiry_date: string
  storage_location: string
  minimum_order_quantity: number
  bulk_discount_available: boolean
  bulk_discount_percentage: number
  quality_grade: string
  origin_country: string
  certifications: string[]
  photos: string[]
  created_at: string
  agent_id: string
  field_agents?: {
    full_name: string
    email: string
    phone_number: string
  }
}

export default function ProductReviewPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
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
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          field_agents(full_name, email, phone_number)
        `)
        .eq('id', productId)
        .single()

      if (error) throw error

      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!product) return

    try {
      setUpdating(true)
      const { error } = await supabase
        .from('products')
        .update({ status: 'approved' })
        .eq('id', product.id)

      if (error) throw error

      alert('Product approved successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error approving product:', error)
      alert('Failed to approve product')
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!product) return

    try {
      setUpdating(true)
      const { error } = await supabase
        .from('products')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason || null
        })
        .eq('id', product.id)

      if (error) throw error

      alert('Product rejected successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error rejecting product:', error)
      alert('Failed to reject product')
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

  const getAvailabilityBadge = (status: string) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-700',
      out_of_stock: 'bg-red-100 text-red-700',
      discontinued: 'bg-gray-100 text-gray-700'
    }
    return styles[status as keyof typeof styles] || styles.in_stock
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'GNF' ? 'GNF' : 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
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
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            Back to products
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
            href="/admin/products"
            className="inline-flex items-center gap-2 text-white hover:text-jawudi-mint transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Submitted on {formatDate(product.created_at)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                  product.status
                )}`}
              >
                {product.status.toUpperCase()}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getAvailabilityBadge(
                  product.availability_status
                )}`}
              >
                {product.availability_status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos */}
            {product.photos && product.photos.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.photos.map((photo, index) => (
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
            {product.description && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-900">{product.category}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Brand</p>
                  <p className="text-lg font-semibold text-gray-900">{product.brand || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unit Measure</p>
                  <p className="text-lg font-semibold text-gray-900">{product.unit_measure}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity Available</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.quantity_available} {product.unit_measure}
                  </p>
                </div>
                {product.sku && (
                  <div>
                    <p className="text-sm text-gray-600">SKU</p>
                    <p className="text-lg font-semibold text-gray-900">{product.sku}</p>
                  </div>
                )}
                {product.barcode && (
                  <div>
                    <p className="text-sm text-gray-600">Barcode</p>
                    <p className="text-lg font-semibold text-gray-900">{product.barcode}</p>
                  </div>
                )}
                {product.expiry_date && (
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(product.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {product.storage_location && (
                  <div>
                    <p className="text-sm text-gray-600">Storage Location</p>
                    <p className="text-lg font-semibold text-gray-900">{product.storage_location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Ordering */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Ordering</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Buy Price</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(product.buy_price, product.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                  <span className="text-gray-600">Sell Price</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(product.sell_price, product.currency)}
                  </span>
                </div>
                {product.minimum_order_quantity > 0 && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Minimum Order</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {product.minimum_order_quantity} {product.unit_measure}
                    </span>
                  </div>
                )}
                {product.bulk_discount_available && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">Bulk Discount</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {product.bulk_discount_percentage}% off
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quality & Origin */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quality & Origin</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.quality_grade && (
                  <div>
                    <p className="text-sm text-gray-600">Quality Grade</p>
                    <p className="text-lg font-semibold text-gray-900">{product.quality_grade}</p>
                  </div>
                )}
                {product.origin_country && (
                  <div>
                    <p className="text-sm text-gray-600">Origin Country</p>
                    <p className="text-lg font-semibold text-gray-900">{product.origin_country}</p>
                  </div>
                )}
                {product.certifications && product.certifications.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                      {product.field_agents?.full_name || 'Unknown Agent'}
                    </p>
                    <p className="text-sm text-gray-600">Field Agent</p>
                  </div>
                </div>
                {product.field_agents?.email && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Email:</span> {product.field_agents.email}
                  </div>
                )}
                {product.field_agents?.phone_number && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Phone:</span> {product.field_agents.phone_number}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {product.status === 'submitted' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Review Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {updating ? 'Approving...' : 'Approve Product'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Product
                  </button>
                </div>
              </div>
            )}

            {product.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Approved</p>
                    <p className="text-sm">This product has been approved</p>
                  </div>
                </div>
              </div>
            )}

            {product.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 text-red-700 mb-2">
                  <XCircle className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Rejected</p>
                    <p className="text-sm">This product has been rejected</p>
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Product</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this product? You can optionally provide a reason:
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
