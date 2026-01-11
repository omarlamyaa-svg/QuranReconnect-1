import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getSubmissionById, updateSubmissionStatus } from '@/lib/db/queries'
import { Status } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const submission = await getSubmissionById(params.id)

    if (!submission) {
      return NextResponse.json(
        { error: 'Inzending niet gevonden' },
        { status: 404 }
      )
    }

    const user = session.user as any

    // Check toegang: student kan alleen eigen submissions zien
    if (user.role === 'STUDENT' && submission.studentId !== user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    return NextResponse.json({ data: submission })
  } catch (error) {
    console.error('Get submission error:', error)
    return NextResponse.json(
      { error: 'Kon inzending niet ophalen' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const user = session.user as any

    // Alleen admins kunnen submissions updaten
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Alleen docenten kunnen inzendingen beoordelen' },
        { status: 403 }
      )
    }

    const { status, grade } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is verplicht' },
        { status: 400 }
      )
    }

    // Valideer status
    if (!Object.values(Status).includes(status)) {
      return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 })
    }

    // Als status APPROVED is, moet grade worden opgegeven
    if (status === Status.APPROVED && (grade === undefined || grade === null)) {
      return NextResponse.json(
        { error: 'Cijfer is verplicht bij goedkeuring' },
        { status: 400 }
      )
    }

    const submission = await updateSubmissionStatus(params.id, status, grade)

    return NextResponse.json({ data: submission })
  } catch (error) {
    console.error('Update submission error:', error)
    return NextResponse.json(
      { error: 'Kon inzending niet bijwerken' },
      { status: 500 }
    )
  }
}
