'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { SURAHS } from '@/lib/data/surahs'

type TestType = 'HIFZ' | 'RECITATION' | 'TAJWEED'

interface FormData {
  type: TestType
  surah: number | null
  ayahStart: number | null
  ayahEnd: number | null
}

export default function TestPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    type: 'RECITATION',
    surah: null,
    ayahStart: null,
    ayahEnd: null,
  })
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const selectedSurah = formData.surah ? SURAHS.find(s => s.number === formData.surah) : null

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Setup audio context for visualization
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

      drawWaveform()
    } catch (err) {
      setError('Kon microfoon niet activeren. Controleer of u toestemming heeft gegeven.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
      drawWaveform()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    setIsPaused(false)
    setDuration(0)
    setAudioBlob(null)
    setAudioUrl(null)
    if (timerRef.current) clearInterval(timerRef.current)
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
  }

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const analyser = analyserRef.current

    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording || isPaused) return
      animationRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      // Dark background
      ctx.fillStyle = 'rgba(18, 26, 45, 1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Gold bars
      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8

        // Gold gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
        gradient.addColorStop(0, '#f4e4a6')
        gradient.addColorStop(0.5, '#d4af37')
        gradient.addColorStop(1, '#b8941f')

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight)

        x += barWidth
      }
    }

    draw()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    if (!audioBlob || !formData.surah) return

    setIsSubmitting(true)
    setError(null)

    try {
      // First, get upload URL
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: `recording-${Date.now()}.webm`,
          contentType: 'audio/webm',
        }),
      })

      if (!uploadRes.ok) throw new Error('Kon upload URL niet ophalen')

      const { uploadUrl, fileUrl } = await uploadRes.json()

      // Upload audio file
      const uploadFileRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: audioBlob,
        headers: { 'Content-Type': 'audio/webm' },
      })

      if (!uploadFileRes.ok) throw new Error('Kon bestand niet uploaden')

      // Create submission
      const submissionRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          surah: formData.surah,
          ayahStart: formData.ayahStart,
          ayahEnd: formData.ayahEnd,
          audioUrl: fileUrl,
          duration,
        }),
      })

      if (!submissionRes.ok) throw new Error('Kon inzending niet aanmaken')

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen geometric-pattern star-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <span className="text-[var(--midnight)] font-bold text-2xl">ق</span>
          </div>
          <p className="text-[var(--ivory-dim)]">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen geometric-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center">
                <span className="text-[var(--midnight)] font-bold text-lg">ق</span>
              </div>
              <span className="text-xl font-semibold gold-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Quran Evaluatie
              </span>
            </Link>
            <Link href="/dashboard" className="text-[var(--ivory-dim)] hover:text-[var(--gold)] transition-colors text-sm">
              ← Terug naar dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <p className="arabic-text text-xl gold-accent mb-4 opacity-70">
              وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
            </p>
            <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="gold-gradient-text">Nieuwe Inzending</span>
            </h1>
            <p className="text-[var(--ivory-dim)]">
              Neem uw recitatie op voor beoordeling
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in-up delay-100">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step >= s
                    ? 'bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] text-[var(--midnight)]'
                    : 'bg-[var(--midnight-lighter)] text-[var(--ivory-dim)] border border-[var(--gold)]/20'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-0.5 ${step > s ? 'bg-[var(--gold)]' : 'bg-[var(--midnight-lighter)]'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Type & Surah */}
          {step === 1 && (
            <div className="sacred-card p-8 animate-fade-in-up delay-200">
              <h2 className="text-2xl gold-gradient-text mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Selecteer type en surah
              </h2>

              {/* Test Type */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-3">
                  Type toets
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['RECITATION', 'HIFZ', 'TAJWEED'] as TestType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      className={`p-4 rounded-xl border transition-all ${
                        formData.type === type
                          ? 'bg-[var(--gold)]/10 border-[var(--gold)] text-[var(--gold)]'
                          : 'bg-[var(--midnight-lighter)]/50 border-[var(--gold)]/10 text-[var(--ivory-dim)] hover:border-[var(--gold)]/30'
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {type === 'RECITATION' ? '📖' : type === 'HIFZ' ? '🧠' : '📿'}
                      </div>
                      <div className="text-sm font-medium">
                        {type === 'RECITATION' ? 'Recitatie' : type === 'HIFZ' ? 'Hifz' : 'Tajweed'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Surah Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-3">
                  Surah
                </label>
                <select
                  value={formData.surah || ''}
                  onChange={(e) => setFormData({ ...formData, surah: parseInt(e.target.value), ayahStart: 1, ayahEnd: null })}
                  className="input-sacred"
                >
                  <option value="">Selecteer een surah...</option>
                  {SURAHS.map((surah) => (
                    <option key={surah.number} value={surah.number}>
                      {surah.number}. {surah.name} ({surah.arabicName}) - {surah.verses} ayaat
                    </option>
                  ))}
                </select>
              </div>

              {/* Ayah Range */}
              {selectedSurah && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-3">
                      Van ayah
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedSurah.verses}
                      value={formData.ayahStart || 1}
                      onChange={(e) => setFormData({ ...formData, ayahStart: parseInt(e.target.value) })}
                      className="input-sacred"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ivory-dim)] mb-3">
                      Tot ayah
                    </label>
                    <input
                      type="number"
                      min={formData.ayahStart || 1}
                      max={selectedSurah.verses}
                      value={formData.ayahEnd || selectedSurah.verses}
                      onChange={(e) => setFormData({ ...formData, ayahEnd: parseInt(e.target.value) })}
                      className="input-sacred"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => formData.surah && setStep(2)}
                disabled={!formData.surah}
                className="btn-sacred w-full"
              >
                Doorgaan naar opname
              </button>
            </div>
          )}

          {/* Step 2: Recording */}
          {step === 2 && (
            <div className="sacred-card p-8 animate-fade-in-up">
              <h2 className="text-2xl gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Audio opname
              </h2>
              <p className="text-[var(--ivory-dim)] mb-8">
                {selectedSurah?.name} - Ayah {formData.ayahStart || 1} tot {formData.ayahEnd || selectedSurah?.verses}
              </p>

              {error && (
                <div className="p-4 bg-[var(--ruby)]/20 border border-[var(--ruby)]/40 rounded-lg text-[#fca5a5] text-sm mb-6">
                  {error}
                </div>
              )}

              {/* Waveform Canvas */}
              <div className="mb-8">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={120}
                  className="w-full h-32 rounded-xl bg-[var(--midnight-light)] border border-[var(--gold)]/10"
                />
              </div>

              {/* Duration Display */}
              <div className="text-center mb-8">
                <div className="text-5xl font-light gold-gradient-text mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {formatTime(duration)}
                </div>
                <p className="text-[var(--ivory-dim)] text-sm">
                  {!isRecording && !audioBlob && 'Klaar om op te nemen'}
                  {isRecording && !isPaused && 'Opname bezig...'}
                  {isPaused && 'Gepauzeerd'}
                  {audioBlob && !isRecording && 'Opname voltooid'}
                </p>
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {!isRecording && !audioBlob && (
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] flex items-center justify-center text-[var(--midnight)] hover:scale-105 transition-transform animate-pulse-glow"
                  >
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V21h-2v-5.07z" />
                    </svg>
                  </button>
                )}

                {isRecording && (
                  <>
                    {!isPaused ? (
                      <button
                        onClick={pauseRecording}
                        className="w-16 h-16 rounded-full bg-[var(--midnight-lighter)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={resumeRecording}
                        className="w-16 h-16 rounded-full bg-[var(--midnight-lighter)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={stopRecording}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--ruby)] to-[#a13350] flex items-center justify-center text-white hover:scale-105 transition-transform"
                    >
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h12v12H6z" />
                      </svg>
                    </button>

                    <button
                      onClick={cancelRecording}
                      className="w-12 h-12 rounded-full bg-[var(--midnight-lighter)] border border-[var(--gold)]/20 flex items-center justify-center text-[var(--ivory-dim)] hover:text-[var(--ivory)] transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}

                {audioBlob && !isRecording && (
                  <>
                    <button
                      onClick={cancelRecording}
                      className="btn-sacred-outline"
                    >
                      Opnieuw opnemen
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="btn-sacred"
                    >
                      Doorgaan
                    </button>
                  </>
                )}
              </div>

              {/* Audio Preview */}
              {audioUrl && (
                <div className="p-4 bg-[var(--midnight-lighter)]/50 rounded-xl border border-[var(--gold)]/10">
                  <p className="text-sm text-[var(--ivory-dim)] mb-3">Preview:</p>
                  <audio src={audioUrl} controls className="w-full" />
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                className="mt-6 text-[var(--ivory-dim)] hover:text-[var(--gold)] transition-colors text-sm"
              >
                ← Terug naar selectie
              </button>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="sacred-card p-8 animate-fade-in-up">
              <h2 className="text-2xl gold-gradient-text mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Controleer en verzend
              </h2>

              {error && (
                <div className="p-4 bg-[var(--ruby)]/20 border border-[var(--ruby)]/40 rounded-lg text-[#fca5a5] text-sm mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-[var(--midnight-lighter)]/50 rounded-xl border border-[var(--gold)]/10">
                  <p className="text-sm text-[var(--ivory-dim)]">Type toets</p>
                  <p className="text-[var(--ivory)] font-medium">
                    {formData.type === 'RECITATION' ? 'Recitatie' : formData.type === 'HIFZ' ? 'Hifz' : 'Tajweed'}
                  </p>
                </div>

                <div className="p-4 bg-[var(--midnight-lighter)]/50 rounded-xl border border-[var(--gold)]/10">
                  <p className="text-sm text-[var(--ivory-dim)]">Surah</p>
                  <p className="text-[var(--ivory)] font-medium">
                    {selectedSurah?.number}. {selectedSurah?.name} ({selectedSurah?.arabicName})
                  </p>
                </div>

                <div className="p-4 bg-[var(--midnight-lighter)]/50 rounded-xl border border-[var(--gold)]/10">
                  <p className="text-sm text-[var(--ivory-dim)]">Ayaat</p>
                  <p className="text-[var(--ivory)] font-medium">
                    {formData.ayahStart || 1} - {formData.ayahEnd || selectedSurah?.verses}
                  </p>
                </div>

                <div className="p-4 bg-[var(--midnight-lighter)]/50 rounded-xl border border-[var(--gold)]/10">
                  <p className="text-sm text-[var(--ivory-dim)]">Duur opname</p>
                  <p className="text-[var(--ivory)] font-medium">{formatTime(duration)}</p>
                </div>

                {audioUrl && (
                  <div className="p-4 bg-[var(--midnight-lighter)]/50 rounded-xl border border-[var(--gold)]/10">
                    <p className="text-sm text-[var(--ivory-dim)] mb-3">Audio preview</p>
                    <audio src={audioUrl} controls className="w-full" />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="btn-sacred-outline flex-1"
                >
                  Terug
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-sacred flex-1 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Bezig met verzenden...</span>
                    </>
                  ) : (
                    'Verzenden ter beoordeling'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--gold)]/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--ivory-dim)]">
            Quran Evaluatie Platform - Moge Allah uw recitatie accepteren
          </p>
        </div>
      </footer>
    </div>
  )
}
