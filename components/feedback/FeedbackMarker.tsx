'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import type { Feedback } from '@/types'
import { formatDuration } from '@/lib/audio/upload'

interface FeedbackMarkerProps {
  feedback: Feedback
  isActive: boolean
  onClick: () => void
}

export function FeedbackMarker({
  feedback,
  isActive,
  onClick,
}: FeedbackMarkerProps) {
  const categoryColors: Record<string, string> = {
    MADD: 'bg-purple-100 border-purple-300',
    GHUNNAH: 'bg-blue-100 border-blue-300',
    IKHFA: 'bg-green-100 border-green-300',
    IZHAR: 'bg-yellow-100 border-yellow-300',
    IDGHAM: 'bg-red-100 border-red-300',
    QALQALAH: 'bg-pink-100 border-pink-300',
    PRONUNCIATION: 'bg-orange-100 border-orange-300',
    OTHER: 'bg-gray-100 border-gray-300',
  }

  const categoryColor = feedback.category
    ? categoryColors[feedback.category]
    : categoryColors.OTHER

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${
        isActive ? 'scale-105' : ''
      }`}
    >
      {/* Marker dot */}
      <div
        className={`absolute -left-8 top-2 w-4 h-4 rounded-full border-2 ${
          isActive
            ? 'bg-primary-600 border-primary-600 ring-4 ring-primary-100'
            : 'bg-white border-primary-400'
        }`}
      />

      {/* Feedback card */}
      <div
        className={`p-4 rounded-lg border-2 transition-all ${
          isActive
            ? 'border-primary-500 bg-primary-50'
            : `border-gray-200 bg-white hover:border-primary-300`
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary-600">
              {formatDuration(Math.floor(feedback.timestamp))}
            </span>
            {feedback.category && (
              <Badge variant="default">{feedback.category}</Badge>
            )}
            {feedback.audioUrl && (
              <svg
                className="w-4 h-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {(feedback as any).admin?.name || 'Docent'}
          </span>
        </div>

        <p
          className={`text-sm text-gray-700 line-clamp-2 ${
            isActive ? 'line-clamp-none' : ''
          }`}
        >
          {feedback.comment}
        </p>

        {isActive && (
          <div className="mt-2 text-xs text-gray-400">
            {new Date(feedback.createdAt).toLocaleString('nl-NL')}
          </div>
        )}
      </div>
    </div>
  )
}
