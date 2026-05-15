import { NextRequest, NextResponse } from 'next/server'

// Mock user and log data storage
const users: Record<string, any> = {
  'user-demo-001': {
    id: 'user-demo-001',
    email: 'demo@example.com',
    name: 'Demo User',
    calorieGoal: 2000,
    currentWeight: 170,
    weightGoal: 160,
  },
}

const logs: Record<string, any[]> = {
  'user-demo-001': Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    totalCalories: 1800 + Math.random() * 400,
    totalWorkoutCals: 300 + Math.random() * 200,
    weight: 170 - (i / 30) * 3 + Math.random() * 2,
  })),
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const days = req.nextUrl.searchParams.get('days') || '30'

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = users[userId]
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const history = logs[userId] || []
    const dayCount = parseInt(days)
    const recentHistory = history.slice(-dayCount)

    // Get today's data
    const today = new Date().toISOString().split('T')[0]
    const todayLog = recentHistory.find((l) => l.date === today) || {
      totalCalories: 0,
      totalWorkoutCals: 0,
      mealsCount: 0,
      workoutsCount: 0,
    }

    const stats = {
      user,
      today: {
        totalCalories: Math.round(todayLog.totalCalories),
        totalWorkoutCals: Math.round(todayLog.totalWorkoutCals),
        netCalories: Math.round(
          todayLog.totalCalories - todayLog.totalWorkoutCals
        ),
        remaining: Math.round(
          user.calorieGoal - (todayLog.totalCalories - todayLog.totalWorkoutCals)
        ),
        mealsCount: todayLog.mealsCount || 3,
        workoutsCount: todayLog.workoutsCount || 1,
      },
      history: recentHistory,
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
