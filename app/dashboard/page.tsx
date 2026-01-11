'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HifzMap } from '@/components/progress/HifzMap'
import { ProgressTracker } from '@/components/progress/ProgressTracker'
import type { StudentStats, Progress } from '@/types'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [progress, setProgress] = useState<Progress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, progressRes] = await Promise.all([
          fetch('/api/stats/student'),
          fetch('/api/progress'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.data)
        }

        if (progressRes.ok) {
          const progressData = await progressRes.json()
          setProgress(progressData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  const user = session?.user as any

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard - {user?.name}
              </h1>
              <p className="text-sm text-gray-600">
                {user?.level || 'Beginner'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/test">
                <Button>Nieuwe inzending</Button>
              </Link>
              <button
                onClick={() => router.push('/auth/logout')}
                className="text-gray-600 hover:text-gray-900"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Totaal inzendingen</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalSubmissions || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">In afwachting</p>
                <p className="text-3xl font-bold text-warning-600">
                  {stats?.pendingSubmissions || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Goedgekeurd</p>
                <p className="text-3xl font-bold text-success-600">
                  {stats?.approvedSubmissions || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Gemiddeld cijfer</p>
                <p className="text-3xl font-bold text-primary-600">
                  {stats?.averageGrade?.toFixed(1) || '0.0'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hifz Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hifz Voortgang</CardTitle>
          </CardHeader>
          <CardContent>
            <HifzMap
              progress={progress}
              onSurahClick={(surah) => console.log('Surah clicked:', surah)}
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recente activiteit</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="info">
                            {submission.assignment.type}
                          </Badge>
                          {submission.assignment.surah && (
                            <span className="text-sm text-gray-600">
                              Surah {submission.assignment.surah}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString(
                            'nl-NL'
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {submission.grade !== null && (
                          <span className="font-semibold text-lg">
                            {submission.grade}
                          </span>
                        )}
                        <StatusBadge status={submission.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nog geen activiteit
                </p>
              )}
            </CardContent>
          </Card>

          {/* Progress Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Recente voortgang</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressTracker progress={progress} limit={5} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
