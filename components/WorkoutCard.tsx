'use client'

import { Workout } from '@/lib/store'
import { Trash2, Activity } from 'lucide-react'

interface WorkoutCardProps {
  workout: Workout
  onDelete: (id: string) => void
}

const INTENSITY_COLORS: Record<string, string> = {
  low: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  moderate:
    'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
  high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
}

export default function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  const intensityClass = INTENSITY_COLORS[workout.intensity] || INTENSITY_COLORS.moderate

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Activity size={20} className="text-secondary" />
          <h3 className="font-bold text-lg">{workout.exerciseType}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${intensityClass}`}>
            {workout.intensity}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Duration</p>
            <p className="font-semibold">{workout.duration} min</p>
          </div>
          {workout.caloriesBurned > 0 && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Burned</p>
              <p className="font-semibold text-secondary">{workout.caloriesBurned}</p>
            </div>
          )}
        </div>

        {workout.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
            "{workout.notes}"
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(workout.id)}
        className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
        title="Delete workout"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}
