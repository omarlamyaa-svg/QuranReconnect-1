import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/client'

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
    const { data: existingUser } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Er bestaat al een account met dit emailadres' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate unique ID
    const id = `c${Date.now()}${Math.random().toString(36).substring(2, 9)}`

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('User')
      .insert({
        id,
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        level: 'BEGINNER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: `Database fout: ${error.message}` },
        { status: 500 }
      )
    }

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
    return NextResponse.json(
      { error: `Er is een fout opgetreden: ${error?.message || 'Onbekende fout'}` },
      { status: 500 }
    )
  }
}
