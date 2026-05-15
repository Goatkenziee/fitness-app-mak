'use client'

import { Meal } from '@/lib/store'
import { Trash2 } from 'lucide-react'

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition">
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Calories</p>
            <p className="font-semibold text-primary">{meal.calories}</p>
          </div>
          {meal.protein > 0 && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Protein</p>
              <p className="font-semibold">{meal.protein.toFixed(1)}g</p>
            </div>
          )}
          {meal.carbs > 0 && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Carbs</p>
              <p className="font-semibold">{meal.carbs.toFixed(1)}g</p>
            </div>
          )}
          {meal.fat > 0 && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Fat</p>
              <p className="font-semibold">{meal.fat.toFixed(1)}g</p>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(meal.id)}
        className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
        title="Delete meal"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}
