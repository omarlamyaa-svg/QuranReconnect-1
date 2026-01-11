'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TextArea, Select } from '@/components/ui/Input'
import { AudioRecorder } from '@/components/audio/AudioRecorder'
import type { ErrorCategory } from '@/types'

interface FeedbackFormProps {
  onSubmit: (comment: string, category?: ErrorCategory, audioBlob?: Blob) => void
  onCancel: () => void
}

export function FeedbackForm({ onSubmit, onCancel }: FeedbackFormProps) {
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState<ErrorCategory | ''>('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      alert('Voer een opmerking in')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(
        comment,
        category || undefined,
        audioBlob || undefined
      )
      // Reset form
      setComment('')
      setCategory('')
      setAudioBlob(null)
      setShowAudioRecorder(false)
    } catch (error) {
      console.error('Fout bij opslaan feedback:', error)
      alert('Er is een fout opgetreden bij het opslaan van de feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions = [
    { value: '', label: 'Geen specifieke categorie' },
    { value: 'MADD', label: 'Madd' },
    { value: 'GHUNNAH', label: 'Ghunnah' },
    { value: 'IKHFA', label: 'Ikhfa' },
    { value: 'IZHAR', label: 'Izhar' },
    { value: 'IDGHAM', label: 'Idgham' },
    { value: 'QALQALAH', label: 'Qalqalah' },
    { value: 'PRONUNCIATION', label: 'Uitspraak' },
    { value: 'OTHER', label: 'Overig' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Categorie"
        options={categoryOptions}
        value={category}
        onChange={(e) => setCategory(e.target.value as ErrorCategory | '')}
      />

      <TextArea
        label="Opmerking"
        placeholder="Geef hier je feedback..."
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      {/* Audio feedback optie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Audio feedback (optioneel)
        </label>

        {!showAudioRecorder && !audioBlob && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowAudioRecorder(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
            Voeg audio feedback toe
          </Button>
        )}

        {showAudioRecorder && !audioBlob && (
          <div className="space-y-2">
            <AudioRecorder
              onRecordingComplete={(blob) => {
                setAudioBlob(blob)
                setShowAudioRecorder(false)
              }}
              maxDuration={60}
              showWaveform={false}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAudioRecorder(false)}
            >
              Annuleer audio opname
            </Button>
          </div>
        )}

        {audioBlob && (
          <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-200 rounded-lg">
            <svg
              className="w-5 h-5 text-success-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-success-700">
              Audio feedback opgenomen
            </span>
            <button
              type="button"
              onClick={() => setAudioBlob(null)}
              className="ml-auto text-sm text-error-600 hover:text-error-700"
            >
              Verwijder
            </button>
          </div>
        )}
      </div>

      {/* Form actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuleer
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Feedback opslaan
        </Button>
      </div>
    </form>
  )
}
