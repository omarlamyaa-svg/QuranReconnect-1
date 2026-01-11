'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { AdminStats } from '@/types'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats/admin')
        if (res.ok) {
          const data = await res.json()
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchStats()
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

  // Check if user is admin
  if (user?.role !== 'ADMIN') {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Docent Dashboard - {user?.name}
              </h1>
              <p className="text-sm text-gray-600">Administratie overzicht</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="secondary">Student weergave</Button>
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
                <p className="text-sm text-gray-600 mb-1">Totaal studenten</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalStudents || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Te beoordelen</p>
                <p className="text-3xl font-bold text-warning-600">
                  {stats?.pendingReviews || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">
                  Totaal inzendingen
                </p>
                <p className="text-3xl font-bold text-primary-600">
                  {stats?.totalSubmissions || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Gemiddeld cijfer</p>
                <p className="text-3xl font-bold text-success-600">
                  {stats?.averageGrade?.toFixed(1) || '0.0'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recente inzendingen</CardTitle>
              <Link href="/admin/submissions">
                <Button variant="secondary" size="sm">
                  Alle inzendingen
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/submissions/${submission.id}`)
                    }
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          {submission.student.name}
                        </span>
                        <Badge variant="info">
                          {submission.assignment.type}
                        </Badge>
                        {submission.assignment.surah && (
                          <span className="text-sm text-gray-600">
                            Surah {submission.assignment.surah}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{submission.student.email}</span>
                        <span>•</span>
                        <span>
                          {new Date(submission.createdAt).toLocaleDateString(
                            'nl-NL'
                          )}
                        </span>
                        <span>•</span>
                        <span>
                          {Math.floor(submission.duration / 60)}:
                          {String(submission.duration % 60).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {submission.feedbacks && submission.feedbacks.length > 0 && (
                        <Badge variant="default">
                          {submission.feedbacks.length} feedback
                        </Badge>
                      )}
                      {submission.grade !== null && (
                        <span className="font-semibold text-lg px-3 py-1 bg-gray-100 rounded">
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
                Nog geen inzendingen
              </p>
            )}
          </CardContent>
        </Card>

        {/* Error Categories Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Meest voorkomende fouten</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.categoryStats && stats.categoryStats.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.categoryStats
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 8)
                  .map((item) => (
                    <div
                      key={item.category}
                      className="p-4 border border-gray-200 rounded-lg text-center"
                    >
                      <p className="text-2xl font-bold text-primary-600">
                        {item.count}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.category}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nog geen feedback gegeven
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
