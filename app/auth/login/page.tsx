'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welkom terug
          </h1>
          <p className="text-gray-600">Log in om verder te gaan</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inloggen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
              />

              <Input
                label="Wachtwoord"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Inloggen
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700"
              >
                ← Terug naar home
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-2">Demo accounts:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Student: student@example.com / password</p>
            <p>Docent: admin@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
