import { NextRequest, NextResponse } from 'next/server'

// In-memory meal storage (would be database in production)
const meals: Record<string, any[]> = {}

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

    const userMeals = meals[userId] || []
    if (!date) {
      return NextResponse.json(userMeals)
    }

    // Filter by date
    const filteredMeals = userMeals.filter((m) => m.date === date)
    return NextResponse.json(filteredMeals)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
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

    const { name, calories, protein, carbs, fat } = await req.json()

    if (!name || !calories) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!meals[userId]) {
      meals[userId] = []
    }

    const meal = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    }

    meals[userId].push(meal)
    return NextResponse.json(meal)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create meal' },
      { status: 500 }
    )
  }
}
