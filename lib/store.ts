import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  calorieGoal: number
  currentWeight?: number
  weightGoal?: number
}

export interface Meal {
  id: string
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  date: string
  createdAt: Date
}

export interface Workout {
  id: string
  exerciseType: string
  duration: number
  intensity: string
  caloriesBurned: number
  notes?: string
  date: string
  createdAt: Date
}

interface StoreState {
  user: User | null
  todayMeals: Meal[]
  todayWorkouts: Workout[]
  isDarkMode: boolean

  // Actions
  setUser: (user: User | null) => void
  setTodayMeals: (meals: Meal[]) => void
  addMeal: (meal: Meal) => void
  removeMeal: (id: string) => void
  setTodayWorkouts: (workouts: Workout[]) => void
  addWorkout: (workout: Workout) => void
  removeWorkout: (id: string) => void
  toggleDarkMode: () => void
  logout: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      todayMeals: [],
      todayWorkouts: [],
      isDarkMode: false,

      setUser: (user) => set({ user }),
      setTodayMeals: (meals) => set({ todayMeals: meals }),
      addMeal: (meal) =>
        set((state) => ({
          todayMeals: [...state.todayMeals, meal],
        })),
      removeMeal: (id) =>
        set((state) => ({
          todayMeals: state.todayMeals.filter((m) => m.id !== id),
        })),
      setTodayWorkouts: (workouts) => set({ todayWorkouts: workouts }),
      addWorkout: (workout) =>
        set((state) => ({
          todayWorkouts: [...state.todayWorkouts, workout],
        })),
      removeWorkout: (id) =>
        set((state) => ({
          todayWorkouts: state.todayWorkouts.filter((w) => w.id !== id),
        })),
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      logout: () =>
        set({
          user: null,
          todayMeals: [],
          todayWorkouts: [],
        }),
    }),
    {
      name: 'fitness-app-store',
    }
  )
)
