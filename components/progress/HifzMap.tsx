'use client'

import React from 'react'
import { SURAHS } from '@/lib/data/surahs'
import type { Progress } from '@/types'

interface HifzMapProps {
  progress: Progress[]
  onSurahClick?: (surah: number) => void
}

export function HifzMap({ progress, onSurahClick }: HifzMapProps) {
  // Creëer een map voor snelle lookup
  const progressMap = new Map(
    progress.map((p) => [p.surah, p])
  )

  const getStatusColor = (surah: number) => {
    const surahProgress = progressMap.get(surah)

    if (!surahProgress) {
      return 'bg-gray-100 border-gray-300 text-gray-600'
    }

    if (surahProgress.completed) {
      if (surahProgress.grade !== null && surahProgress.grade !== undefined) {
        if (surahProgress.grade >= 8) {
          return 'bg-success-500 border-success-600 text-white'
        } else if (surahProgress.grade >= 6) {
          return 'bg-warning-500 border-warning-600 text-white'
        } else {
          return 'bg-error-500 border-error-600 text-white'
        }
      }
      return 'bg-primary-500 border-primary-600 text-white'
    }

    return 'bg-primary-100 border-primary-300 text-primary-700'
  }

  const getTooltipText = (surah: number) => {
    const surahData = SURAHS[surah - 1]
    const surahProgress = progressMap.get(surah)

    let text = `${surah}. ${surahData.name} (${surahData.arabicName})\n${surahData.verses} verzen`

    if (surahProgress) {
      if (surahProgress.completed) {
        text += '\n✓ Afgerond'
        if (surahProgress.grade !== null) {
          text += ` - Cijfer: ${surahProgress.grade}/10`
        }
      } else {
        text += '\n⏳ In behandeling'
      }
    } else {
      text += '\n○ Nog niet gestart'
    }

    return text
  }

  return (
    <div className="space-y-6">
      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
          <span>Niet gestart</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-100 border border-primary-300 rounded" />
          <span>In behandeling</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success-500 border border-success-600 rounded" />
          <span>Uitstekend (8-10)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-warning-500 border border-warning-600 rounded" />
          <span>Voldoende (6-8)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-error-500 border border-error-600 rounded" />
          <span>Onvoldoende (&lt;6)</span>
        </div>
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2">
        {SURAHS.map((surah) => (
          <button
            key={surah.number}
            onClick={() => onSurahClick?.(surah.number)}
            className={`
              aspect-square rounded-lg border-2 font-semibold text-sm
              transition-all hover:scale-110 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${getStatusColor(surah.number)}
            `}
            title={getTooltipText(surah.number)}
          >
            {surah.number}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {progress.filter((p) => p.completed).length}
          </div>
          <div className="text-sm text-gray-600">Afgerond</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {progress.filter((p) => !p.completed).length}
          </div>
          <div className="text-sm text-gray-600">In behandeling</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {114 - progress.length}
          </div>
          <div className="text-sm text-gray-600">Nog niet gestart</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {progress.length > 0
              ? Math.round(
                  (progress.filter((p) => p.completed).length / 114) * 100
                )
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Voortgang</div>
        </div>
      </div>
    </div>
  )
}
