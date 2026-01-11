'use client'

import { useState } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'

interface PhotoUploadProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
  maxPhotos?: number
  label?: string
}

export default function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos = 10,
  label = 'Photos'
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length + photos.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`)
      return
    }

    setUploading(true)
    const newPhotos: string[] = []

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue
      }

      try {
        // Convert to base64 data URL
        const dataUrl = await fileToDataURL(file)

        // Compress if needed (if > 2MB)
        if (file.size > 2 * 1024 * 1024) {
          const compressed = await compressImage(dataUrl)
          newPhotos.push(compressed)
        } else {
          newPhotos.push(dataUrl)
        }
      } catch (error) {
        console.error('Error processing image:', error)
      }
    }

    onPhotosChange([...photos, ...newPhotos])
    setUploading(false)

    // Reset input
    e.target.value = ''
  }

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Max dimension 1920px
        const maxDimension = 1920
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension
            width = maxDimension
          } else {
            width = (width / height) * maxDimension
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to JPEG with 0.8 quality
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = dataUrl
    })
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(newPhotos)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map((dataUrl, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={dataUrl}
              alt={`${label} ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">Add Photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {photos.length} of {maxPhotos} photos added
      </p>
    </div>
  )
}
