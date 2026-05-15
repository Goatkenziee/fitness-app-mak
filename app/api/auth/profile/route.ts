import { NextRequest, NextResponse } from 'next/server'

// In-memory user storage (would be database in production)
const users: Record<string, any> = {
  'user-demo-001': {
    id: 'user-demo-001',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    calorieGoal: 2000,
    currentWeight: 170,
    weightGoal: 160,
  },
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
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

    const { name, calorieGoal, currentWeight, weightGoal } = await req.json()

    // Update user
    if (name) user.name = name
    if (calorieGoal) user.calorieGoal = calorieGoal
    if (currentWeight !== undefined) user.currentWeight = currentWeight
    if (weightGoal !== undefined) user.weightGoal = weightGoal

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json(
      { error: 'Profile update failed' },
      { status: 500 }
    )
  }
}
