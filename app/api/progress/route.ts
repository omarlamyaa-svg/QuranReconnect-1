import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getProgressByStudent } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const user = session.user as any

    // Studenten krijgen alleen hun eigen progress
    const progress = await getProgressByStudent(user.id)

    return NextResponse.json({ data: progress })
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: 'Kon voortgang niet ophalen' },
      { status: 500 }
    )
  }
}
