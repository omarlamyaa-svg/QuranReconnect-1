import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getFeedbacksBySubmission } from '@/lib/db/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const feedbacks = await getFeedbacksBySubmission(params.submissionId)

    return NextResponse.json({ data: feedbacks })
  } catch (error) {
    console.error('Get feedbacks error:', error)
    return NextResponse.json(
      { error: 'Kon feedback niet ophalen' },
      { status: 500 }
    )
  }
}
