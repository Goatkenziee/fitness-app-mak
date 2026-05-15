'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, Workout } from '@/lib/store'
import Navbar from '@/components/Navbar'
import WorkoutCard from '@/components/WorkoutCard'
import { Plus } from 'lucide-react'

const EXERCISE_TYPES = [
  'Running',
  'Cycling',
  'Swimming',
  'Weightlifting',
  'Yoga',
  'HIIT',
  'Walking',
  'Basketball',
  'Soccer',
  'Boxing',
  'Pilates',
  'CrossFit',
  'Other',
]

export default function WorkoutsPage() {
  const router = useRouter()
  const { user, todayWorkouts, setTodayWorkouts, addWorkout, removeWorkout } = useStore()
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    exerciseType: 'Running',
    duration: '',
    intensity: 'moderate',
    caloriesBurned: '',
    notes: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const fetchWorkouts = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const res = await fetch(`/api/workouts?date=${today}`, {
          headers: { 'x-user-id': user.id },
        })
        if (res.ok) {
          const workouts = await res.json()
          setTodayWorkouts(workouts)
        }
      } catch (error) {
        console.error('Failed to fetch workouts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [user, router, setTodayWorkouts])

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.duration) {
      alert('Please fill in duration')
      return
    }

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.id,
        },
        body: JSON.stringify({
          exerciseType: formData.exerciseType,
          duration: parseInt(formData.duration),
          intensity: formData.intensity,
          caloriesBurned: formData.caloriesBurned
            ? parseInt(formData.caloriesBurned)
            : undefined,
          notes: formData.notes || undefined,
        }),
      })

      if (res.ok) {
        const workout = await res.json()
        addWorkout(workout)
        setFormData({
          exerciseType: 'Running',
          duration: '',
          intensity: 'moderate',
          caloriesBurned: '',
          notes: '',
        })
        setFormOpen(false)
      }
    } catch (error) {
      console.error('Failed to add workout:', error)
      alert('Failed to add workout')
    }
  }

  const handleDeleteWorkout = async (id: string) => {
    try {
      removeWorkout(id)
    } catch (error) {
      console.error('Failed to delete workout:', error)
    }
  }

  const totalCaloriesBurned = todayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)
  const totalDuration = todayWorkouts.reduce((sum, w) => sum + w.duration, 0)

  if (!user) return null
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Workout Tracker</h1>

          {/* Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calories Burned</p>
              <p className="text-3xl font-bold text-secondary">{totalCaloriesBurned}</p>
              <p className="text-xs text-gray-500">today</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Duration</p>
              <p className="text-3xl font-bold">{totalDuration}</p>
              <p className="text-xs text-gray-500">minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Workouts</p>
              <p className="text-3xl font-bold">{todayWorkouts.length}</p>
              <p className="text-xs text-gray-500">today</p>
            </div>
          </div>
        </div>

        {/* Add Workout Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition mb-4"
          >
            <Plus size={20} /> Add Workout
          </button>

          {formOpen && (
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Exercise Type *</label>
                <select
                  value={formData.exerciseType}
                  onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value })}
                  className="w-full"
                >
                  {EXERCISE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (min) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Intensity *</label>
                  <select
                    value={formData.intensity}
                    onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                    className="w-full"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Calories Burned</label>
                <input
                  type="number"
                  value={formData.caloriesBurned}
                  onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                  placeholder="0 (optional)"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How did you feel? Any observations?"
                  rows={3}
                  className="w-full"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-secondary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
              >
                Log Workout
              </button>
            </form>
          )}
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Workouts</h2>
          {todayWorkouts.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">No workouts logged yet</p>
              <p className="text-sm text-gray-500">Add your first workout to get started!</p>
            </div>
          ) : (
            todayWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onDelete={handleDeleteWorkout}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
