'use client'

import React, { useState } from 'react'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { FeedbackMarker } from './FeedbackMarker'
import { FeedbackForm } from './FeedbackForm'
import type { Feedback, ErrorCategory } from '@/types'

interface FeedbackPlayerProps {
  audioUrl: string
  feedbacks: Feedback[]
  onAddFeedback?: (
    timestamp: number,
    comment: string,
    category?: ErrorCategory,
    audioBlob?: Blob
  ) => void
  isAdmin: boolean
}

export function FeedbackPlayer({
  audioUrl,
  feedbacks,
  onAddFeedback,
  isAdmin,
}: FeedbackPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  const handleMarkerClick = (timestamp: number) => {
    setSelectedTimestamp(timestamp)
  }

  const handleAddFeedbackClick = () => {
    setSelectedTimestamp(currentTime)
    setShowFeedbackForm(true)
  }

  const handleSubmitFeedback = async (
    comment: string,
    category?: ErrorCategory,
    audioBlob?: Blob
  ) => {
    if (selectedTimestamp !== null && onAddFeedback) {
      await onAddFeedback(selectedTimestamp, comment, category, audioBlob)
      setShowFeedbackForm(false)
      setSelectedTimestamp(null)
    }
  }

  const sortedFeedbacks = [...feedbacks].sort((a, b) => a.timestamp - b.timestamp)
  const selectedFeedback = feedbacks.find(
    (f) => f.timestamp === selectedTimestamp
  )

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <AudioPlayer audioUrl={audioUrl} onTimeUpdate={handleTimeUpdate} />
      </div>

      {/* Feedback Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Feedback ({feedbacks.length})
          </h3>
          {isAdmin && onAddFeedback && (
            <button
              onClick={handleAddFeedbackClick}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Feedback toevoegen op {Math.floor(currentTime)}s
            </button>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200" />

          <div className="space-y-4 pl-8">
            {sortedFeedbacks.length === 0 ? (
              <p className="text-gray-500 italic">Nog geen feedback gegeven</p>
            ) : (
              sortedFeedbacks.map((feedback) => (
                <FeedbackMarker
                  key={feedback.id}
                  feedback={feedback}
                  isActive={selectedTimestamp === feedback.timestamp}
                  onClick={() => handleMarkerClick(feedback.timestamp)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Selected Feedback Detail */}
      {selectedFeedback && !showFeedbackForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Feedback op {Math.floor(selectedFeedback.timestamp)}s
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Docent:</span>
              <p className="text-gray-900">
                {(selectedFeedback as any).admin?.name || 'Onbekend'}
              </p>
            </div>
            {selectedFeedback.category && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Categorie:
                </span>
                <p className="text-gray-900">{selectedFeedback.category}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">
                Opmerking:
              </span>
              <p className="text-gray-900 whitespace-pre-wrap">
                {selectedFeedback.comment}
              </p>
            </div>
            {selectedFeedback.audioUrl && (
              <div>
                <span className="text-sm font-medium text-gray-500 block mb-2">
                  Audio feedback:
                </span>
                <AudioPlayer audioUrl={selectedFeedback.audioUrl} />
              </div>
            )}
            <div className="text-xs text-gray-400">
              {new Date(selectedFeedback.createdAt).toLocaleString('nl-NL')}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      {showFeedbackForm && selectedTimestamp !== null && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Feedback toevoegen op {Math.floor(selectedTimestamp)}s
          </h3>
          <FeedbackForm
            onSubmit={handleSubmitFeedback}
            onCancel={() => {
              setShowFeedbackForm(false)
              setSelectedTimestamp(null)
            }}
          />
        </div>
      )}
    </div>
  )
}
