import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Naam, email en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Wachtwoord moet minimaal 6 karakters zijn' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Er bestaat al een account met dit emailadres' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        level: 'BEGINNER',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Account succesvol aangemaakt',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)

    // Provide more specific error messages
    let errorMessage = 'Er is een fout opgetreden bij het registreren'

    if (error?.message?.includes("Can't reach database")) {
      errorMessage = 'Database niet bereikbaar. Het Supabase project is mogelijk gepauzeerd.'
    } else if (error?.code === 'P2002') {
      errorMessage = 'Er bestaat al een account met dit emailadres'
    } else if (error?.message) {
      errorMessage = `Database fout: ${error.message.substring(0, 100)}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
