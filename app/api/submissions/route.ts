import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/prisma'
import { getSubmissionsByStudent, getPendingSubmissions } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const user = session.user as any

    let submissions

    if (user.role === 'ADMIN') {
      // Admin krijgt alle pending submissions
      submissions = await getPendingSubmissions()
    } else {
      // Student krijgt alleen eigen submissions
      submissions = await getSubmissionsByStudent(user.id)
    }

    return NextResponse.json({ data: submissions })
  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Kon inzendingen niet ophalen' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const user = session.user as any

    // Alleen studenten kunnen submissions maken
    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Alleen studenten kunnen inzendingen maken' },
        { status: 403 }
      )
    }

    const { assignmentId, audioUrl, duration } = await request.json()

    if (!assignmentId || !audioUrl || !duration) {
      return NextResponse.json(
        { error: 'assignmentId, audioUrl en duration zijn verplicht' },
        { status: 400 }
      )
    }

    const submission = await prisma.submission.create({
      data: {
        studentId: user.id,
        assignmentId,
        audioUrl,
        duration,
        status: 'PENDING',
      },
      include: {
        assignment: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
          },
        },
      },
    })

    return NextResponse.json({ data: submission }, { status: 201 })
  } catch (error) {
    console.error('Create submission error:', error)
    return NextResponse.json(
      { error: 'Kon inzending niet aanmaken' },
      { status: 500 }
    )
  }
}
