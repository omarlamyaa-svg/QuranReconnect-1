import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createFeedback } from '@/lib/db/queries'
import { ErrorCategory } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const user = session.user as any

    // Alleen admins kunnen feedback geven
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Alleen docenten kunnen feedback geven' },
        { status: 403 }
      )
    }

    const { submissionId, timestamp, comment, category, audioUrl } =
      await request.json()

    if (!submissionId || timestamp === undefined || !comment) {
      return NextResponse.json(
        { error: 'submissionId, timestamp en comment zijn verplicht' },
        { status: 400 }
      )
    }

    // Valideer category als opgegeven
    if (category && !Object.values(ErrorCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Ongeldige categorie' },
        { status: 400 }
      )
    }

    const feedback = await createFeedback({
      submissionId,
      adminId: user.id,
      timestamp,
      comment,
      category: category || undefined,
      audioUrl: audioUrl || undefined,
    })

    return NextResponse.json({ data: feedback }, { status: 201 })
  } catch (error) {
    console.error('Create feedback error:', error)
    return NextResponse.json(
      { error: 'Kon feedback niet aanmaken' },
      { status: 500 }
    )
  }
}
