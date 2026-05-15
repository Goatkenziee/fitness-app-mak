'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { LogOut, Settings, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, setUser } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('fitness-app-store')
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <nav className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="font-bold text-2xl text-primary">
            FitMAK
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="hover:text-primary transition">
              Dashboard
            </Link>
            <Link href="/tracker" className="hover:text-primary transition">
              Tracker
            </Link>
            <Link href="/workouts" className="hover:text-primary transition">
              Workouts
            </Link>
            <Link href="/profile" className="hover:text-primary transition">
              Profile
            </Link>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="block py-2 hover:text-primary">
              Dashboard
            </Link>
            <Link href="/tracker" className="block py-2 hover:text-primary">
              Tracker
            </Link>
            <Link href="/workouts" className="block py-2 hover:text-primary">
              Workouts
            </Link>
            <Link href="/profile" className="block py-2 hover:text-primary">
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
