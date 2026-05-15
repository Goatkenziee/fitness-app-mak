'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, Meal } from '@/lib/store'
import Navbar from '@/components/Navbar'
import MealCard from '@/components/MealCard'
import { Plus } from 'lucide-react'

export default function TrackerPage() {
  const router = useRouter()
  const { user, todayMeals, setTodayMeals, addMeal, removeMeal } = useStore()
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const fetchMeals = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const res = await fetch(`/api/meals?date=${today}`, {
          headers: { 'x-user-id': user.id },
        })
        if (res.ok) {
          const meals = await res.json()
          setTodayMeals(meals)
        }
      } catch (error) {
        console.error('Failed to fetch meals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [user, router, setTodayMeals])

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.calories) {
      alert('Please fill in meal name and calories')
      return
    }

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.id,
        },
        body: JSON.stringify({
          name: formData.name,
          calories: parseInt(formData.calories),
          protein: formData.protein ? parseFloat(formData.protein) : undefined,
          carbs: formData.carbs ? parseFloat(formData.carbs) : undefined,
          fat: formData.fat ? parseFloat(formData.fat) : undefined,
        }),
      })

      if (res.ok) {
        const meal = await res.json()
        addMeal(meal)
        setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' })
        setFormOpen(false)
      }
    } catch (error) {
      console.error('Failed to add meal:', error)
      alert('Failed to add meal')
    }
  }

  const handleDeleteMeal = async (id: string) => {
    try {
      // In a real app, you'd call DELETE /api/meals/:id
      removeMeal(id)
    } catch (error) {
      console.error('Failed to delete meal:', error)
    }
  }

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0)
  const remaining = (user?.calorieGoal || 2000) - totalCalories

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
          <h1 className="text-4xl font-bold mb-4">Calorie Tracker</h1>

          {/* Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Intake</p>
              <p className="text-3xl font-bold text-primary">{totalCalories}</p>
              <p className="text-xs text-gray-500">of {user.calorieGoal} kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
              <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {remaining}
              </p>
              <p className="text-xs text-gray-500">calories left</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meals Logged</p>
              <p className="text-3xl font-bold">{todayMeals.length}</p>
              <p className="text-xs text-gray-500">today</p>
            </div>
          </div>
        </div>

        {/* Add Meal Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition mb-4"
          >
            <Plus size={20} /> Add Meal
          </button>

          {formOpen && (
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Meal Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chicken with Rice"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Calories *</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
              >
                Log Meal
              </button>
            </form>
          )}
        </div>

        {/* Meals List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Meals</h2>
          {todayMeals.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">No meals logged yet</p>
              <p className="text-sm text-gray-500">Add your first meal to get started!</p>
            </div>
          ) : (
            todayMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={handleDeleteMeal}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
