'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import Navbar from '@/components/Navbar'
import { User, Save } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser } = useStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    calorieGoal: 2000,
    currentWeight: 0,
    weightGoal: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      calorieGoal: user.calorieGoal || 2000,
      currentWeight: user.currentWeight || 0,
      weightGoal: user.weightGoal || 0,
    })
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.id,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const updatedUser = await res.json()
        setUser({
          ...updatedUser,
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
        })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your fitness goals and personal information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg mb-6 border border-green-300 dark:border-green-700">
            Profile updated successfully! ✓
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User size={20} /> Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Fitness Goals Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-bold mb-4">Fitness Goals</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Daily Calorie Goal
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      name="calorieGoal"
                      value={formData.calorieGoal}
                      onChange={handleChange}
                      min="1000"
                      max="5000"
                      step="50"
                      className="flex-1"
                    />
                    <span className="text-gray-600 dark:text-gray-400">kcal/day</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Typical range: 1200-3000 kcal depending on activity level and goals
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Weight
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="currentWeight"
                        value={formData.currentWeight}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        className="flex-1"
                      />
                      <span className="text-gray-600 dark:text-gray-400">lbs</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Weight</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="weightGoal"
                        value={formData.weightGoal}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        className="flex-1"
                      />
                      <span className="text-gray-600 dark:text-gray-400">lbs</span>
                    </div>
                  </div>
                </div>

                {formData.currentWeight > 0 && formData.weightGoal > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {formData.currentWeight > formData.weightGoal
                        ? `Goal: Lose ${(formData.currentWeight - formData.weightGoal).toFixed(1)} lbs`
                        : formData.currentWeight < formData.weightGoal
                          ? `Goal: Gain ${(formData.weightGoal - formData.currentWeight).toFixed(1)} lbs`
                          : 'You are at your goal weight!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="font-bold mb-2">Calorie Goal Guidelines</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              <strong>Sedentary:</strong> 1200-1800 kcal/day
            </li>
            <li>
              <strong>Light Activity:</strong> 1500-2200 kcal/day
            </li>
            <li>
              <strong>Moderate Activity:</strong> 1800-2500 kcal/day
            </li>
            <li>
              <strong>Very Active:</strong> 2200-3000+ kcal/day
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
