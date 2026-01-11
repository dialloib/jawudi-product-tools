'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Package, ArrowLeft, Filter, DollarSign, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  product_name: string
  category: string
  brand: string
  unit_measure: string
  sell_price: number
  currency: string
  status: string
  availability_status: string
  created_at: string
  agent_id: string
  field_agents?: {
    full_name: string
  }
}

export default function ProductsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams?.get('status') || 'all'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(statusFilter)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    fetchProducts()
  }, [selectedStatus])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
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

      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
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
          <p className="text-gray-600">Loading products...</p>
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
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Products</h1>
              <p className="text-gray-300">{products.length} total products</p>
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

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all'
                ? 'No products have been submitted yet.'
                : `No products with status "${selectedStatus}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <div className="p-6">
                  {/* Status Badges */}
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        product.status
                      )}`}
                    >
                      {product.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatDate(product.created_at)}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition line-clamp-2">
                    {product.product_name}
                  </h3>

                  {/* Category & Brand */}
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Tag className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{product.category}</span>
                  </div>
                  {product.brand && (
                    <div className="text-sm text-gray-600 mb-2">
                      Brand: <span className="font-semibold">{product.brand}</span>
                    </div>
                  )}

                  {/* Unit Measure */}
                  <div className="text-sm text-gray-600 mb-2">
                    Unit: {product.unit_measure}
                  </div>

                  {/* Price */}
                  {product.sell_price && (
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                      <DollarSign className="w-5 h-5" />
                      {formatCurrency(product.sell_price, product.currency)}
                    </div>
                  )}

                  {/* Availability */}
                  <div className="mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getAvailabilityBadge(
                        product.availability_status
                      )}`}
                    >
                      {product.availability_status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Agent Info */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Submitted by{' '}
                      <span className="font-semibold text-gray-700">
                        {product.field_agents?.full_name || 'Unknown Agent'}
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
