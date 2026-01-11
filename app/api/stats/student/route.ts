import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getStudentStats } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const user = session.user as any

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Alleen voor studenten' },
        { status: 403 }
      )
    }

    const stats = await getStudentStats(user.id)

    return NextResponse.json({ data: stats })
  } catch (error) {
    console.error('Get student stats error:', error)
    return NextResponse.json(
      { error: 'Kon statistieken niet ophalen' },
      { status: 500 }
    )
  }
}
