import { NextRequest, NextResponse } from 'next/server'

// In a real app, users would be stored in a database
const users: Record<string, any> = {
  'demo@example.com': {
    id: 'user-demo-001',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    calorieGoal: 2000,
    currentWeight: 170,
    weightGoal: 160,
  },
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Find user
    const user = users[email]
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
