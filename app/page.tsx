import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Quran Evaluatie Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Een asynchroon platform voor het toetsen en verbeteren van Quran
            recitatie, memorisatie en Tajweed
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Audio Opnames</h3>
            <p className="text-gray-600">
              Maak eenvoudig audio-opnames van je recitaties met onze
              geïntegreerde recorder
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Gedetailleerde Feedback
            </h3>
            <p className="text-gray-600">
              Ontvang tijdspecifieke feedback van docenten met categorieën voor
              Tajweed regels
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Voortgang Tracking</h3>
            <p className="text-gray-600">
              Volg je voortgang door alle 114 surahs met visuele Hifz Map
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
          <p className="text-gray-600 mb-8">
            Log in om toegang te krijgen tot je dashboard
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg">Inloggen</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p>© 2024 Quran Evaluatie Platform. Alle rechten voorbehouden.</p>
        </footer>
      </div>
    </div>
  )
}
