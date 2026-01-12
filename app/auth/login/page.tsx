'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij het inloggen')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen geometric-pattern star-pattern flex items-center justify-center px-6 py-12">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[var(--gold)] rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-[var(--gold)] rounded-full opacity-30 animate-float delay-300" />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-[var(--gold)] rounded-full opacity-20 animate-float delay-500" />
      </div>

      {/* Back to home link */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-[var(--ivory-dim)] hover:text-[var(--gold)] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm">Terug naar home</span>
      </Link>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center animate-pulse-glow">
              <span className="text-[var(--midnight)] font-bold text-2xl">ق</span>
            </div>
          </div>

          {/* Arabic greeting */}
          <p className="arabic-text text-xl gold-accent mb-4 opacity-80">
            السَّلَامُ عَلَيْكُمْ
          </p>

          <h1 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="gold-gradient-text">Welkom terug</span>
          </h1>
          <p className="text-[var(--ivory-dim)]">
            Log in om uw reis voort te zetten
          </p>
        </div>

        {/* Login Card */}
        <div className="sacred-card p-8 animate-fade-in-up delay-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-[var(--ruby)]/20 border border-[var(--ruby)]/40 rounded-lg text-[#fca5a5] text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
                className="input-sacred"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-sacred"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-sacred w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Bezig met inloggen...</span>
                </>
              ) : (
                'Inloggen'
              )}
            </button>
          </form>
        </div>

        {/* Demo accounts info */}
        <div className="mt-8 sacred-card p-6 animate-fade-in-up delay-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--sapphire)]/30 border border-[var(--sapphire)]/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#93c5fd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--ivory)]">Demo accounts</p>
          </div>
          <div className="space-y-2 text-sm text-[var(--ivory-dim)]">
            <p className="flex items-center gap-2">
              <span className="badge-sacred badge-pending text-xs">Student</span>
              <span>student@example.com / password</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="badge-sacred badge-approved text-xs">Docent</span>
              <span>admin@example.com / password</span>
            </p>
          </div>
        </div>

        {/* Footer ornament */}
        <div className="mt-10 flex justify-center animate-fade-in-up delay-300">
          <div className="ornament" />
        </div>
      </div>
    </div>
  )
}
