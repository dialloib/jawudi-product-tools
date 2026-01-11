'use client'

import { Home, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'

export function AppHeader() {
  const { agent, signOut } = useAuth()

  if (!agent) return null

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14 md:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-jawudi-mint rounded-full flex items-center justify-center">
            <Home className="w-5 h-5 text-jawudi-navy" />
          </div>
          <span className="hidden md:block font-bold text-gray-900 text-lg">
            Jawudi
          </span>
        </Link>

        {/* User info and logout */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-jawudi-mint to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(agent.full_name)}
          </div>

          {/* Name (hidden on mobile) */}
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {agent.full_name}
          </span>

          {/* Logout button */}
          <button
            onClick={signOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700 hover:text-red-600"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
