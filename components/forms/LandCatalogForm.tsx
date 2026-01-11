'use client'

import React, { useState } from 'react'
import { MapPin, DollarSign, FileText, Droplets, Zap, Home, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LandCatalogForm() {
  const [formData, setFormData] = useState({
    title: '', description: '', countryCode: 'GN', region: '', city: '', address: '',
    latitude: '', longitude: '', landSizeValue: '', landSizeUnit: 'HECTARES', landType: '',
    zoningClassification: '', titleDeedStatus: '', titleDeedNumber: '', topography: '',
    topographyNotes: '', soilType: '', vegetationCover: '', roadAccess: '', roadAccessNotes: '',
    distanceToMainRoad: '', hasElectricity: false, hasWater: false, hasSewage: false,
    utilitiesNotes: '', distanceToMarket: '', distanceToSchool: '', distanceToHospital: '',
    distanceToTownCenter: '', totalPrice: '', pricePerUnit: '', currencyCode: 'GNF',
    priceNegotiable: true, floodRisk: '', environmentalConcerns: '', developmentPotential: '',
    nearbyDevelopments: '', communityTraditionalAuthority: '', hasLandDisputes: false,
    landDisputesNotes: '', seasonalAccess: '', mobileNetworkCoverage: '', securitySituation: '',
    localLanguage: '', customaryRightsNotes: '', ownerBusinessName: '', ownerContact: '',
    ownerPhone: '', ownerEmail: '', notes: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const calculatePricePerUnit = () => {
    if (formData.totalPrice && formData.landSizeValue) {
      const pricePerUnit = parseFloat(formData.totalPrice) / parseFloat(formData.landSizeValue)
      setFormData(prev => ({ ...prev, pricePerUnit: pricePerUnit.toFixed(2) }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just console.log - will integrate with Supabase later
    console.log('Land Listing Data:', formData)
    setSubmitted(true)
  }

  const resetForm = () => {
    setFormData({
      title: '', description: '', countryCode: 'GN', region: '', city: '', address: '',
      latitude: '', longitude: '', landSizeValue: '', landSizeUnit: 'HECTARES', landType: '',
      zoningClassification: '', titleDeedStatus: '', titleDeedNumber: '', topography: '',
      topographyNotes: '', soilType: '', vegetationCover: '', roadAccess: '', roadAccessNotes: '',
      distanceToMainRoad: '', hasElectricity: false, hasWater: false, hasSewage: false,
      utilitiesNotes: '', distanceToMarket: '', distanceToSchool: '', distanceToHospital: '',
      distanceToTownCenter: '', totalPrice: '', pricePerUnit: '', currencyCode: 'GNF',
      priceNegotiable: true, floodRisk: '', environmentalConcerns: '', developmentPotential: '',
      nearbyDevelopments: '', communityTraditionalAuthority: '', hasLandDisputes: false,
      landDisputesNotes: '', seasonalAccess: '', mobileNetworkCoverage: '', securitySituation: '',
      localLanguage: '', customaryRightsNotes: '', ownerBusinessName: '', ownerContact: '',
      ownerPhone: '', ownerEmail: '', notes: ''
    })
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Land Listing Collected!</h2>
            <p className="text-gray-600 mb-6">The land listing has been captured successfully.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-700 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Data saved locally (will sync when connected)</li>
                <li>Upload photos via the submissions page</li>
                <li>Submit for review when ready</li>
              </ol>
            </div>
            <div className="flex gap-3 justify-center flex-col sm:flex-row">
              <button onClick={resetForm} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Collect Another Listing
              </button>
              <Link href="/" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center font-semibold">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Home className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Land Listing Collection</h1>
              <p className="text-gray-600 text-sm sm:text-base">Field Agent Data Collection</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                  placeholder="e.g., 5 Hectare Agricultural Land in Kindia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                  placeholder="Detailed description..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Country <span className="text-red-500">*</span></label>
                <select name="countryCode" value={formData.countryCode} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="GN">Guinea</option>
                  <option value="SN">Senegal</option>
                  <option value="ML">Mali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Region <span className="text-red-500">*</span></label>
                <input type="text" name="region" value={formData.region} onChange={handleChange} required
                  placeholder="e.g., Kindia" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">City <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required
                  placeholder="e.g., Mamou" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Distance to Main Road (km)</label>
                <input type="number" step="0.1" name="distanceToMainRoad" value={formData.distanceToMainRoad} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">Address <span className="text-red-500">*</span></label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows={2}
                  placeholder="Full address with landmarks" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Latitude</label>
                <input type="number" step="0.000001" name="latitude" value={formData.latitude} onChange={handleChange}
                  placeholder="9.5092" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Longitude</label>
                <input type="number" step="0.000001" name="longitude" value={formData.longitude} onChange={handleChange}
                  placeholder="-13.7122" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Land Details */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Land Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Land Size <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="landSizeValue" value={formData.landSizeValue} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Unit <span className="text-red-500">*</span></label>
                <select name="landSizeUnit" value={formData.landSizeUnit} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="HECTARES">Hectares</option>
                  <option value="ACRES">Acres</option>
                  <option value="SQ_METERS">Square Meters</option>
                  <option value="SQ_FEET">Square Feet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Land Type <span className="text-red-500">*</span></label>
                <select name="landType" value={formData.landType} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select...</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="AGRICULTURAL">Agricultural</option>
                  <option value="INDUSTRIAL">Industrial</option>
                  <option value="MIXED_USE">Mixed Use</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Title Deed Status</label>
                <select name="titleDeedStatus" value={formData.titleDeedStatus} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select...</option>
                  <option value="FREEHOLD">Freehold</option>
                  <option value="LEASEHOLD">Leasehold</option>
                  <option value="CUSTOMARY">Customary</option>
                  <option value="PENDING">Pending</option>
                  <option value="NONE">None</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">Title Deed Number</label>
                <input type="text" name="titleDeedNumber" value={formData.titleDeedNumber} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Physical Characteristics */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Physical Characteristics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Topography</label>
                <select name="topography" value={formData.topography} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select...</option>
                  <option value="FLAT">Flat</option>
                  <option value="SLOPED">Sloped</option>
                  <option value="HILLY">Hilly</option>
                  <option value="MIXED">Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Vegetation Cover</label>
                <select name="vegetationCover" value={formData.vegetationCover} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select...</option>
                  <option value="CLEARED">Cleared</option>
                  <option value="LIGHT">Light</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="HEAVY">Heavy</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-gray-700">Soil Type</label>
                <input type="text" name="soilType" value={formData.soilType} onChange={handleChange}
                  placeholder="e.g., Clay, Sandy, Loam" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Road Access</label>
                <select name="roadAccess" value={formData.roadAccess} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select...</option>
                  <option value="PAVED">Paved</option>
                  <option value="UNPAVED">Unpaved</option>
                  <option value="SEASONAL">Seasonal</option>
                  <option value="NONE">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Seasonal Access</label>
                <select name="seasonalAccess" value={formData.seasonalAccess} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select...</option>
                  <option value="YEAR_ROUND">Year Round</option>
                  <option value="DRY_SEASON_ONLY">Dry Season Only</option>
                  <option value="LIMITED_RAINY_SEASON">Limited Rainy Season</option>
                  <option value="DIFFICULT_RAINY_SEASON">Difficult Rainy Season</option>
                </select>
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasElectricity" checked={formData.hasElectricity} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  <Zap className="w-4 h-4" /> Electricity
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasWater" checked={formData.hasWater} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  <Droplets className="w-4 h-4" /> Water
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasSewage" checked={formData.hasSewage} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  Sewage
                </label>
              </div>
            </div>
          </div>

          {/* Nearby Amenities */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nearby Amenities (km)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">To Market</label>
                <input type="number" step="0.1" name="distanceToMarket" value={formData.distanceToMarket} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">To School</label>
                <input type="number" step="0.1" name="distanceToSchool" value={formData.distanceToSchool} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">To Hospital</label>
                <input type="number" step="0.1" name="distanceToHospital" value={formData.distanceToHospital} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">To Town Center</label>
                <input type="number" step="0.1" name="distanceToTownCenter" value={formData.distanceToTownCenter} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Total Price <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="totalPrice" value={formData.totalPrice} onChange={handleChange} required onBlur={calculatePricePerUnit}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Price per Unit</label>
                <input type="number" step="0.01" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Currency</label>
                <select name="currencyCode" value={formData.currencyCode} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="GNF">Guinea Franc</option>
                  <option value="USD">US Dollar</option>
                  <option value="EUR">Euro</option>
                  <option value="XOF">West African CFA</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="priceNegotiable" checked={formData.priceNegotiable} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Price Negotiable</span>
                </label>
              </div>
            </div>
          </div>

          {/* African Context */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">African Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Traditional Authority</label>
                <input type="text" name="communityTraditionalAuthority" value={formData.communityTraditionalAuthority} onChange={handleChange}
                  placeholder="e.g., Village Chief Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Local Language</label>
                <input type="text" name="localLanguage" value={formData.localLanguage} onChange={handleChange}
                  placeholder="e.g., Fulani, Malinke" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Mobile Network</label>
                <input type="text" name="mobileNetworkCoverage" value={formData.mobileNetworkCoverage} onChange={handleChange}
                  placeholder="e.g., Orange, MTN" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Flood Risk</label>
                <select name="floodRisk" value={formData.floodRisk} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select...</option>
                  <option value="NONE">None</option>
                  <option value="LOW">Low</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasLandDisputes" checked={formData.hasLandDisputes} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Has Land Disputes</span>
                </label>
              </div>
              {formData.hasLandDisputes && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Dispute Details</label>
                  <textarea name="landDisputesNotes" value={formData.landDisputesNotes} onChange={handleChange} rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Owner Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Business Name <span className="text-red-500">*</span></label>
                <input type="text" name="ownerBusinessName" value={formData.ownerBusinessName} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Contact Person <span className="text-red-500">*</span></label>
                <input type="text" name="ownerContact" value={formData.ownerContact} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Phone <span className="text-red-500">*</span></label>
                <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
                <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Additional Notes
            </h2>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
              placeholder="Additional observations, concerns, or important details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
              Submit Land Listing
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition">
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
