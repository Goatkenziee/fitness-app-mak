import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory user storage (in production, use a real database)
const users: Record<string, any> = {}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    if (users[email]) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create user
    const userId = Math.random().toString(36).substr(2, 9)
    users[email] = {
      id: userId,
      email,
      password, // In production, hash the password!
      name,
      calorieGoal: 2000,
      currentWeight: 0,
      weightGoal: 0,
      createdAt: new Date(),
    }

    return NextResponse.json({
      id: userId,
      email,
      name,
      calorieGoal: 2000,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
