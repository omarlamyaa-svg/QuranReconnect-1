import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'Quran Evaluatie Platform',
  description: 'Platform voor het toetsen en verbeteren van Quran recitatie, memorisatie en Tajweed',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
