import { NextRequest, NextResponse } from 'next/server'

// In-memory workout storage (would be database in production)
const workouts: Record<string, any[]> = {}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const date = req.nextUrl.searchParams.get('date')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userWorkouts = workouts[userId] || []
    if (!date) {
      return NextResponse.json(userWorkouts)
    }

    // Filter by date
    const filteredWorkouts = userWorkouts.filter((w) => w.date === date)
    return NextResponse.json(filteredWorkouts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { exerciseType, duration, intensity, caloriesBurned, notes } = await req.json()

    if (!exerciseType || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!workouts[userId]) {
      workouts[userId] = []
    }

    const workout = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseType,
      duration,
      intensity: intensity || 'moderate',
      caloriesBurned: caloriesBurned || 0,
      notes: notes || '',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    }

    workouts[userId].push(workout)
    return NextResponse.json(workout)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    )
  }
}
