'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters zijn')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registratie mislukt')
      }

      router.push('/auth/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
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
            مَرْحَبًا بِكَ
          </p>

          <h1 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="gold-gradient-text">Account Aanmaken</span>
          </h1>
          <p className="text-[var(--ivory-dim)]">
            Begin uw reis met de Quran
          </p>
        </div>

        {/* Register Card */}
        <div className="sacred-card p-8 animate-fade-in-up delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-[var(--ruby)]/20 border border-[var(--ruby)]/40 rounded-lg text-[#fca5a5] text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-2">
                Naam
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Uw volledige naam"
                required
                className="input-sacred"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimaal 6 karakters"
                required
                minLength={6}
                className="input-sacred"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-2">
                Bevestig wachtwoord
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Herhaal uw wachtwoord"
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
                  <span>Bezig met registreren...</span>
                </>
              ) : (
                'Account aanmaken'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--ivory-dim)]">
              Heeft u al een account?{' '}
              <Link href="/auth/login" className="text-[var(--gold)] hover:underline">
                Inloggen
              </Link>
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
