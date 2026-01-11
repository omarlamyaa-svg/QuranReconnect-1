import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAdminStats } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const user = session.user as any

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Alleen voor docenten' },
        { status: 403 }
      )
    }

    const stats = await getAdminStats()

    return NextResponse.json({ data: stats })
  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json(
      { error: 'Kon statistieken niet ophalen' },
      { status: 500 }
    )
  }
}
