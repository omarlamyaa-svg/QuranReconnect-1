'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
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
      <div className="min-h-screen geometric-pattern star-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <span className="text-[var(--midnight)] font-bold text-2xl">ق</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-[var(--gold)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-[var(--gold)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-[var(--gold)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="mt-4 text-[var(--ivory-dim)]">Laden...</p>
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
    <div className="min-h-screen geometric-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center">
                <span className="text-[var(--midnight)] font-bold text-lg">ق</span>
              </div>
              <div>
                <span className="text-xl font-semibold gold-gradient-text block" style={{ fontFamily: 'var(--font-display)' }}>
                  Quran Evaluatie
                </span>
                <span className="text-xs text-[var(--ivory-dim)]">Docent Dashboard</span>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="btn-sacred-outline">
                Student weergave
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-[var(--ivory-dim)] hover:text-[var(--gold)] transition-colors text-sm"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-12 animate-fade-in-up">
            <p className="arabic-text text-xl gold-accent mb-2 opacity-70">
              جَزَاكَ اللَّهُ خَيْرًا
            </p>
            <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-[var(--ivory)]">Docent Dashboard</span>
            </h1>
            <p className="text-[var(--ivory-dim)]">
              Welkom {user?.name} - Moge Allah uw onderwijs zegenen
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="sacred-card p-6 animate-fade-in-up delay-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--ivory-dim)] mb-1">Totaal studenten</p>
                  <p className="text-4xl font-light gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                    {stats?.totalStudents || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--sapphire)]/30 to-[var(--midnight)] border border-[var(--sapphire)]/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#93c5fd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="sacred-card p-6 animate-fade-in-up delay-200 animate-pulse-glow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--ivory-dim)] mb-1">Te beoordelen</p>
                  <p className="text-4xl font-light text-[var(--gold)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {stats?.pendingReviews || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--midnight)] border border-[var(--gold)]/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="sacred-card p-6 animate-fade-in-up delay-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--ivory-dim)] mb-1">Totaal inzendingen</p>
                  <p className="text-4xl font-light text-[var(--ivory)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {stats?.totalSubmissions || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--midnight-lighter)] to-[var(--midnight)] border border-[var(--gold)]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="sacred-card p-6 animate-fade-in-up delay-400">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--ivory-dim)] mb-1">Gemiddeld cijfer</p>
                  <p className="text-4xl font-light text-[#6ee7b7]" style={{ fontFamily: 'var(--font-display)' }}>
                    {stats?.averageGrade?.toFixed(1) || '0.0'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--emerald)]/30 to-[var(--midnight)] border border-[var(--emerald)]/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#6ee7b7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="sacred-card p-8 mb-8 animate-fade-in-up delay-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Recente inzendingen
                </h2>
                <p className="text-[var(--ivory-dim)]">Beoordeel de nieuwste studentinzendingen</p>
              </div>
              <Link href="/admin/submissions" className="btn-sacred">
                Alle inzendingen
              </Link>
            </div>

            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentSubmissions.map((submission: any) => (
                  <div
                    key={submission.id}
                    onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                    className="p-6 bg-[var(--midnight-lighter)]/50 border border-[var(--gold)]/10 rounded-xl hover:border-[var(--gold)]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center">
                            <span className="text-[var(--midnight)] font-semibold text-sm">
                              {submission.student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[var(--ivory)]">{submission.student.name}</p>
                            <p className="text-xs text-[var(--ivory-dim)]">{submission.student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="badge-sacred badge-review text-xs">
                            {submission.assignment.type}
                          </span>
                          {submission.assignment.surah && (
                            <span className="text-sm text-[var(--ivory-dim)]">
                              Surah {submission.assignment.surah}
                            </span>
                          )}
                          {submission.feedbacks && submission.feedbacks.length > 0 && (
                            <span className="badge-sacred badge-pending text-xs">
                              {submission.feedbacks.length} feedback
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--ivory-dim)]">
                          {new Date(submission.createdAt).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })} • {Math.floor(submission.duration / 60)}:{String(submission.duration % 60).padStart(2, '0')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {submission.grade !== null && (
                          <span className="text-3xl font-light gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                            {submission.grade}
                          </span>
                        )}
                        <span className={`badge-sacred ${
                          submission.status === 'APPROVED' ? 'badge-approved' :
                          submission.status === 'PENDING' ? 'badge-pending' :
                          submission.status === 'REVIEW' ? 'badge-review' :
                          'badge-retry'
                        }`}>
                          {submission.status === 'APPROVED' ? 'Goedgekeurd' :
                           submission.status === 'PENDING' ? 'In afwachting' :
                           submission.status === 'REVIEW' ? 'In review' :
                           'Opnieuw'}
                        </span>
                        <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-[var(--midnight-lighter)] border border-[var(--gold)]/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[var(--ivory-dim)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-xl text-[var(--ivory)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Nog geen inzendingen
                </p>
                <p className="text-[var(--ivory-dim)]">
                  Wacht op studentinzendingen om te beoordelen
                </p>
              </div>
            )}
          </div>

          {/* Error Categories Stats */}
          <div className="sacred-card p-8 animate-fade-in-up delay-600">
            <h2 className="text-2xl md:text-3xl gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Meest voorkomende fouten
            </h2>
            <p className="text-[var(--ivory-dim)] mb-8">Overzicht van Tajweed categorieën</p>

            {stats?.categoryStats && stats.categoryStats.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.categoryStats
                  .sort((a: any, b: any) => b.count - a.count)
                  .slice(0, 8)
                  .map((item: any) => (
                    <div
                      key={item.category}
                      className="p-6 bg-[var(--midnight-lighter)]/50 border border-[var(--gold)]/10 rounded-xl text-center hover:border-[var(--gold)]/30 transition-all"
                    >
                      <p className="text-3xl font-light gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        {item.count}
                      </p>
                      <p className="text-sm text-[var(--ivory-dim)]">
                        {item.category}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--midnight-lighter)] border border-[var(--gold)]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--ivory-dim)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-[var(--ivory-dim)]">Nog geen feedback gegeven</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--gold)]/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--ivory-dim)]">
            Quran Evaluatie Platform - Docent Panel
          </p>
        </div>
      </footer>
    </div>
  )
}
