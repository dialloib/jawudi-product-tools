'use client'

import React, { useState } from 'react'
import { Camera, MapPin, DollarSign, Package, Info, Building2, CheckCircle, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'

interface Specification {
  key: string
  value: string
}

export default function ProductCollectionForm() {
  const [formData, setFormData] = useState({
    // Basic Product Info
    productName: '',
    description: '',
    category: '',
    brand: '',
    productCode: '',

    // Measurements
    unitMeasure: '',

    // Pricing
    sellPrice: '',
    currency: 'GNF',
    handlingFee: '',
    deliveryCostPerKm: '',

    // Business Constraints
    minOrderQty: '',
    maxOrderQty: '',

    // Tags
    tags: '',

    // Vendor Information
    businessName: '',
    vendorContact: '',
    vendorPhone: '',
    vendorEmail: '',
    vendorAddress: '',
    vendorProductCode: '',
    vendorPrice: '',
    vendorCurrency: 'GNF',
    availableQuantity: '',
    vendorMinOrderQty: '',

    // Additional Notes
    notes: ''
  })

  const [specs, setSpecs] = useState<Specification[]>([{ key: '', value: '' }])
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    'Cement & Concrete',
    'Steel & Metal',
    'Lumber & Wood',
    'Roofing Materials',
    'Hardware & Fasteners',
    'Bricks & Blocks',
    'Aggregates'
  ]

  const unitMeasures = [
    { code: 'BAG', name: 'Bag' },
    { code: 'PC', name: 'Piece' },
    { code: 'BOX', name: 'Box' },
    { code: 'SHEET', name: 'Sheet' },
    { code: 'BUNDLE', name: 'Bundle' },
    { code: 'DOZEN', name: 'Dozen' },
    { code: 'PACK', name: 'Pack' },
    { code: 'KG', name: 'Kilogram' },
    { code: 'G', name: 'Gram' },
    { code: 'TON', name: 'Metric Ton' },
    { code: 'LB', name: 'Pound' },
    { code: 'L', name: 'Liter' },
    { code: 'GAL', name: 'Gallon' },
    { code: 'M3', name: 'Cubic Meter' },
    { code: 'M', name: 'Meter' },
    { code: 'CM', name: 'Centimeter' },
    { code: 'FT', name: 'Foot' },
    { code: 'M2', name: 'Square Meter' },
    { code: 'SQ_FT', name: 'Square Foot' }
  ]

  const currencies = [
    { code: 'GNF', name: 'Guinea Franc' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'XOF', name: 'West African CFA Franc' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = value
    setSpecs(newSpecs)
  }

  const addSpec = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }])
  }

  const removeSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index)
    setSpecs(newSpecs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Format data for submission
    const formattedData = {
      product_catalog: {
        name: formData.productName,
        description: formData.description,
        category: formData.category,
        unit_measure: formData.unitMeasure,
        product_code: formData.productCode || null,
        brand: formData.brand || null,
        sell_price: formData.sellPrice ? parseFloat(formData.sellPrice) : null,
        currency: formData.currency,
        handling_fee_per_unit: formData.handlingFee ? parseFloat(formData.handlingFee) : null,
        delivery_cost_per_km: formData.deliveryCostPerKm ? parseFloat(formData.deliveryCostPerKm) : null,
        minimum_order_quantity: formData.minOrderQty ? parseInt(formData.minOrderQty) : null,
        maximum_order_quantity: formData.maxOrderQty ? parseInt(formData.maxOrderQty) : null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        specifications: Object.fromEntries(
          specs.filter(s => s.key && s.value).map(s => [s.key, s.value])
        ),
      },
      business_product: {
        vendor_info: {
          business_name: formData.businessName,
          contact_person: formData.vendorContact,
          phone: formData.vendorPhone,
          email: formData.vendorEmail,
          address: formData.vendorAddress
        },
        vendor_product_code: formData.vendorProductCode || null,
        price_per_unit: parseFloat(formData.vendorPrice),
        currency: formData.vendorCurrency,
        quantity_available: parseInt(formData.availableQuantity),
        minimum_order_quantity: formData.vendorMinOrderQty ? parseInt(formData.vendorMinOrderQty) : null
      },
      notes: formData.notes
    }

    console.log('Product Data:', JSON.stringify(formattedData, null, 2))
    setSubmitted(true)
  }

  const resetForm = () => {
    setFormData({
      productName: '',
      description: '',
      category: '',
      brand: '',
      productCode: '',
      unitMeasure: '',
      sellPrice: '',
      currency: 'GNF',
      handlingFee: '',
      deliveryCostPerKm: '',
      minOrderQty: '',
      maxOrderQty: '',
      tags: '',
      businessName: '',
      vendorContact: '',
      vendorPhone: '',
      vendorEmail: '',
      vendorAddress: '',
      vendorProductCode: '',
      vendorPrice: '',
      vendorCurrency: 'GNF',
      availableQuantity: '',
      vendorMinOrderQty: '',
      notes: ''
    })
    setSpecs([{ key: '', value: '' }])
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Collected Successfully!</h2>
            <p className="text-gray-600 mb-6">The product information has been captured successfully.</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-700 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Data saved locally (will sync when connected)</li>
                <li>Upload product photos via the submissions page</li>
                <li>Submit for review when ready</li>
              </ol>
            </div>

            <div className="flex gap-3 justify-center flex-col sm:flex-row">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition"
              >
                Collect Another Product
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center font-semibold transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Package className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Collection Form</h1>
              <p className="text-gray-600 text-sm sm:text-base">Field Agent Data Collection</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-emerald-500">
              <Info className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Product Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Dangote Cement 50kg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detailed product description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Brand/Manufacturer
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., Dangote, Sococim"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Code/SKU
                </label>
                <input
                  type="text"
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleChange}
                  placeholder="Optional internal code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Unit of Measure <span className="text-red-500">*</span>
                </label>
                <select
                  name="unitMeasure"
                  value={formData.unitMeasure}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select unit...</option>
                  {unitMeasures.map(unit => (
                    <option key={unit.code} value={unit.code}>
                      {unit.name} ({unit.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., construction, building material, cement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas for better searchability</p>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-emerald-500">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Marketplace Pricing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Sell Price (Catalog)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="sellPrice"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  placeholder="Market price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name} ({curr.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Handling Fee per Unit
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="handlingFee"
                  value={formData.handlingFee}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Delivery Cost per KM
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="deliveryCostPerKm"
                  value={formData.deliveryCostPerKm}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Minimum Order Quantity
                </label>
                <input
                  type="number"
                  name="minOrderQty"
                  value={formData.minOrderQty}
                  onChange={handleChange}
                  placeholder="e.g., 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Maximum Order Quantity
                </label>
                <input
                  type="number"
                  name="maxOrderQty"
                  value={formData.maxOrderQty}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-emerald-500">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Product Specifications</h2>
            </div>

            {specs.map((spec, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    placeholder="Specification name (e.g., Weight, Quality Grade)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g., 50kg, Premium)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSpec}
              className="mt-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition font-semibold"
            >
              + Add Specification
            </button>
          </div>

          {/* Vendor Information */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-emerald-500">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Vendor Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Vendor's business name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vendorContact"
                  value={formData.vendorContact}
                  onChange={handleChange}
                  required
                  placeholder="Owner/Manager name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="vendorPhone"
                  value={formData.vendorPhone}
                  onChange={handleChange}
                  required
                  placeholder="+224 XXX XXX XXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="vendorEmail"
                  value={formData.vendorEmail}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="vendorAddress"
                  value={formData.vendorAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Full business address including neighborhood, city, region"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Vendor Product Code
                </label>
                <input
                  type="text"
                  name="vendorProductCode"
                  value={formData.vendorProductCode}
                  onChange={handleChange}
                  placeholder="Vendor's SKU (if any)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Available Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="availableQuantity"
                  value={formData.availableQuantity}
                  onChange={handleChange}
                  required
                  placeholder="Stock quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Vendor Price per Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="vendorPrice"
                  value={formData.vendorPrice}
                  onChange={handleChange}
                  required
                  placeholder="Vendor's selling price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Vendor Currency
                </label>
                <select
                  name="vendorCurrency"
                  value={formData.vendorCurrency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name} ({curr.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Vendor Min Order Qty
                </label>
                <input
                  type="number"
                  name="vendorMinOrderQty"
                  value={formData.vendorMinOrderQty}
                  onChange={handleChange}
                  placeholder="Vendor's minimum order"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-emerald-500">
              <Info className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Additional Notes</h2>
            </div>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Any additional observations, special conditions, or important information about the product or vendor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Photo Reminder */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Don't Forget Product Photos!</h3>
                <p className="text-sm text-amber-800">
                  Take clear photos of the product from multiple angles. Photos will be uploaded separately
                  after form submission.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-lg"
            >
              Submit Product Information
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
