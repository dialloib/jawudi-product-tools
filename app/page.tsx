import Link from 'next/link'
import { Home, FileText, Package } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jawudi-navy to-deep-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-jawudi-mint rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="w-10 h-10 text-jawudi-navy" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Jawudi Field Agent</h1>
          <p className="text-xl text-gray-300">Data Collection Tool</p>
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

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Powered by Jawudi • Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
