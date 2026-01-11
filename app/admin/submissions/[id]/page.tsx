'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { FeedbackPlayer } from '@/components/feedback/FeedbackPlayer'
import { uploadAudio } from '@/lib/audio/upload'
import type { SubmissionWithRelations, ErrorCategory, Status } from '@/types'

export default function SubmissionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status: authStatus } = useSession()
  const [submission, setSubmission] = useState<SubmissionWithRelations | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newStatus, setNewStatus] = useState<Status>('PENDING')
  const [grade, setGrade] = useState<number>(0)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [authStatus, router])

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(`/api/submissions/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setSubmission(data.data)
          setNewStatus(data.data.status)
          setGrade(data.data.grade || 0)
        }
      } catch (error) {
        console.error('Error fetching submission:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (authStatus === 'authenticated' && params.id) {
      fetchSubmission()
    }
  }, [authStatus, params.id])

  const handleAddFeedback = async (
    timestamp: number,
    comment: string,
    category?: ErrorCategory,
    audioBlob?: Blob
  ) => {
    try {
      let audioUrl: string | undefined

      // Upload audio feedback als aanwezig
      if (audioBlob) {
        audioUrl = await uploadAudio(audioBlob)
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: params.id,
          timestamp,
          comment,
          category,
          audioUrl,
        }),
      })

      if (res.ok) {
        // Refresh submission data
        const submissionRes = await fetch(`/api/submissions/${params.id}`)
        if (submissionRes.ok) {
          const data = await submissionRes.json()
          setSubmission(data.data)
        }
      }
    } catch (error) {
      console.error('Error adding feedback:', error)
      alert('Kon feedback niet toevoegen')
    }
  }

  const handleUpdateStatus = async () => {
    if (newStatus === 'APPROVED' && grade === 0) {
      alert('Voer een cijfer in voor goedkeuring')
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch(`/api/submissions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          grade: newStatus === 'APPROVED' ? grade : undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSubmission(data.data)
        alert('Status bijgewerkt!')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Kon status niet bijwerken')
    } finally {
      setIsSaving(false)
    }
  }

  if (authStatus === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Inzending niet gevonden</p>
      </div>
    )
  }

  const user = session?.user as any
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="text-primary-600 hover:text-primary-700 mb-2"
              >
                ← Terug
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Inzending Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Player */}
            <FeedbackPlayer
              audioUrl={submission.audioUrl}
              feedbacks={submission.feedbacks || []}
              onAddFeedback={isAdmin ? handleAddFeedback : undefined}
              isAdmin={isAdmin}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informatie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="font-semibold">{submission.student.name}</p>
                  <p className="text-sm text-gray-500">
                    {submission.student.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{submission.assignment.type}</p>
                </div>

                {submission.assignment.surah && (
                  <div>
                    <p className="text-sm text-gray-600">Surah</p>
                    <p className="font-semibold">
                      Surah {submission.assignment.surah}
                    </p>
                    {submission.assignment.startVerse &&
                      submission.assignment.endVerse && (
                        <p className="text-sm text-gray-500">
                          Vers {submission.assignment.startVerse} -{' '}
                          {submission.assignment.endVerse}
                        </p>
                      )}
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Duur</p>
                  <p className="font-semibold">
                    {Math.floor(submission.duration / 60)}:
                    {String(submission.duration % 60).padStart(2, '0')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Ingediend op</p>
                  <p className="font-semibold">
                    {new Date(submission.createdAt).toLocaleString('nl-NL')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <StatusBadge status={submission.status} />
                </div>

                {submission.grade !== null && (
                  <div>
                    <p className="text-sm text-gray-600">Cijfer</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {submission.grade}
                      <span className="text-lg text-gray-500">/10</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Beoordeling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    label="Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Status)}
                    options={[
                      { value: 'PENDING', label: 'In afwachting' },
                      { value: 'IN_REVIEW', label: 'In beoordeling' },
                      { value: 'APPROVED', label: 'Goedgekeurd' },
                      { value: 'RETRY_REQUESTED', label: 'Herhaling nodig' },
                    ]}
                  />

                  {newStatus === 'APPROVED' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cijfer (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={grade}
                        onChange={(e) => setGrade(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleUpdateStatus}
                    className="w-full"
                    isLoading={isSaving}
                  >
                    Status bijwerken
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
