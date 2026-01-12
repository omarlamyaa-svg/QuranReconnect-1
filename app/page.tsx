import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen geometric-pattern star-pattern">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[var(--gold)] rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-[var(--gold)] rounded-full opacity-30 animate-float delay-300" />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-[var(--gold)] rounded-full opacity-20 animate-float delay-500" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[var(--gold)] rounded-full opacity-25 animate-float delay-700" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center">
                <span className="text-[var(--midnight)] font-bold text-lg">ق</span>
              </div>
              <span className="text-xl font-semibold gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Quran Evaluatie
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="btn-sacred-outline">
                Inloggen
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Arabic Bismillah */}
          <div className="animate-fade-in-up">
            <p className="arabic-text text-3xl md:text-4xl gold-accent mb-6 opacity-80">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>

          <div className="ornament animate-fade-in-up delay-100" />

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 animate-fade-in-up delay-200" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="gold-gradient-text">Quran</span>
            <br />
            <span className="text-[var(--ivory)]">Evaluatie Platform</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[var(--ivory-dim)] max-w-2xl mx-auto mb-12 animate-fade-in-up delay-300">
            Een contemplatieve ruimte voor het verfijnen van uw Quran recitatie,
            memorisatie en Tajweed onder begeleiding van ervaren docenten.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <Link href="/auth/login" className="btn-sacred">
              Begin uw reis
            </Link>
            <Link href="#features" className="btn-sacred-outline">
              Ontdek meer
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-in-up delay-600">
            <div className="flex flex-col items-center gap-2 opacity-50">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-[var(--gold)] to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-[0.3em] gold-accent mb-4 animate-fade-in-up">
              Functionaliteiten
            </p>
            <h2 className="text-4xl md:text-5xl mb-6 animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-display)' }}>
              Uw pad naar <span className="gold-gradient-text">excellentie</span>
            </h2>
            <div className="ornament animate-fade-in-up delay-200" />
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="sacred-card p-8 animate-fade-in-up delay-200">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--midnight-lighter)] to-[var(--midnight)] border border-[var(--gold)]/30 flex items-center justify-center mb-6 animate-pulse-glow">
                <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl mb-4 gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Audio Opnames
              </h3>
              <p className="text-[var(--ivory-dim)] leading-relaxed">
                Neem uw recitaties op met onze verfijnde audio recorder,
                compleet met real-time waveform visualisatie en perfecte geluidskwaliteit.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="sacred-card p-8 animate-fade-in-up delay-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--midnight-lighter)] to-[var(--midnight)] border border-[var(--gold)]/30 flex items-center justify-center mb-6 animate-pulse-glow">
                <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-2xl mb-4 gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Gedetailleerde Feedback
              </h3>
              <p className="text-[var(--ivory-dim)] leading-relaxed">
                Ontvang tijdspecifieke feedback van ervaren docenten met
                categorieën voor alle Tajweed regels en uitspraak nuances.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="sacred-card p-8 animate-fade-in-up delay-400">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--midnight-lighter)] to-[var(--midnight)] border border-[var(--gold)]/30 flex items-center justify-center mb-6 animate-pulse-glow">
                <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl mb-4 gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Hifz Voortgang
              </h3>
              <p className="text-[var(--ivory-dim)] leading-relaxed">
                Volg uw reis door alle 114 surahs met onze visuele Hifz Map,
                een elegant overzicht van uw memorisatie voortgang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="sacred-card p-12 md:p-16 text-center animate-fade-in-scale">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div>
                <p className="text-4xl md:text-5xl font-light gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>114</p>
                <p className="text-sm uppercase tracking-wider text-[var(--ivory-dim)]">Surahs</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-light gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>6236</p>
                <p className="text-sm uppercase tracking-wider text-[var(--ivory-dim)]">Ayaat</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-light gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>8</p>
                <p className="text-sm uppercase tracking-wider text-[var(--ivory-dim)]">Tajweed Categorieën</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-light gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>∞</p>
                <p className="text-sm uppercase tracking-wider text-[var(--ivory-dim)]">Zegeningen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Quote Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <svg className="w-12 h-12 mx-auto mb-8 text-[var(--gold)] opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="arabic-text text-2xl md:text-3xl gold-accent mb-6">
              خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </p>
            <p className="text-xl md:text-2xl text-[var(--ivory)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              &ldquo;De beste onder jullie is degene die de Quran leert en onderwijst.&rdquo;
            </p>
            <p className="text-[var(--ivory-dim)]">— Sahih al-Bukhari</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="sacred-card p-12 md:p-16 animate-fade-in-scale animate-pulse-glow">
            <h2 className="text-3xl md:text-4xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Klaar om te <span className="gold-gradient-text">beginnen?</span>
            </h2>
            <p className="text-[var(--ivory-dim)] mb-8 max-w-lg mx-auto">
              Start vandaag uw reis naar perfectie in Quran recitatie.
              Onze docenten staan klaar om u te begeleiden.
            </p>
            <Link href="/auth/login" className="btn-sacred inline-block">
              Begin nu
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-[var(--gold)]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center">
                <span className="text-[var(--midnight)] font-bold text-sm">ق</span>
              </div>
              <span className="text-lg gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Quran Evaluatie Platform
              </span>
            </div>
            <p className="text-sm text-[var(--ivory-dim)]">
              © 2024 Alle rechten voorbehouden
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
