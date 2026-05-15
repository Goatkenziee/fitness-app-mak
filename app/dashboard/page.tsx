'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import Navbar from '@/components/Navbar'
import Chart from '@/components/Chart'
import { TrendingUp, Flame, Target, Gauge } from 'lucide-react'

interface Stats {
  user: any
  today: {
    totalCalories: number
    totalWorkoutCals: number
    netCalories: number
    remaining: number
    mealsCount: number
    workoutsCount: number
  }
  history: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats?days=30', {
          headers: { 'x-user-id': user.id },
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, router])

  if (!user) return null
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )

  const caloriePercentage =
    stats && stats.today.totalCalories > 0
      ? (stats.today.totalCalories / stats.user.calorieGoal) * 100
      : 0

  const chartData = stats?.history.slice(-30).map((log: any) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: log.totalCalories,
    workoutCals: log.totalWorkoutCals,
    weight: log.weight,
  })) || []

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Today's Calories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Today's Intake</h3>
              <Flame size={24} className="text-primary" />
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold text-primary">{stats?.today.totalCalories || 0}</p>
              <p className="text-sm text-gray-500">of {stats?.user.calorieGoal || 2000} kcal</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Workout Calories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Calories Burned</h3>
              <Flame size={24} className="text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary">
              {stats?.today.totalWorkoutCals || 0}
            </p>
            <p className="text-sm text-gray-500">from {stats?.today.workoutsCount || 0} workout(s)</p>
          </div>

          {/* Net Calories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Net Calories</h3>
              <Gauge size={24} className="text-accent" />
            </div>
            <p className="text-3xl font-bold text-accent">
              {stats?.today.netCalories || 0}
            </p>
            <p className="text-sm text-gray-500">
              {stats && stats.today.remaining > 0 ? '+' : ''}{stats?.today.remaining || 0} remaining
            </p>
          </div>

          {/* Meals Logged */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Meals Logged</h3>
              <Target size={24} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-500">{stats?.today.mealsCount || 0}</p>
            <p className="text-sm text-gray-500">meals this week on average</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Calorie Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Calorie Trend (30 days)</h2>
            <Chart
              data={chartData}
              type="line"
              dataKey="calories"
              name="Total Calories"
              color="#10b981"
            />
          </div>

          {/* Weight Trend */}
          {chartData.some((d: any) => d.weight) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Weight Progress</h2>
              <Chart
                data={chartData}
                type="line"
                dataKey="weight"
                name="Weight (lbs)"
                color="#3b82f6"
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/tracker"
              className="bg-primary hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition text-center"
            >
              Log Meal
            </a>
            <a
              href="/workouts"
              className="bg-secondary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition text-center"
            >
              Log Workout
            </a>
            <a
              href="/profile"
              className="bg-accent hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition text-center"
            >
              Update Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
