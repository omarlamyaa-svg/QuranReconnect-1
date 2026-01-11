'use client'

import React from 'react'
import type { Progress } from '@/types'
import { SURAHS, getSurahByNumber } from '@/lib/data/surahs'
import { Badge } from '@/components/ui/Badge'

interface ProgressTrackerProps {
  progress: Progress[]
  limit?: number
}

export function ProgressTracker({ progress, limit }: ProgressTrackerProps) {
  const sortedProgress = [...progress]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)

  if (sortedProgress.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nog geen voortgang geregistreerd
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sortedProgress.map((item) => {
        const surah = getSurahByNumber(item.surah)
        if (!surah) return null

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-100 text-primary-700 font-bold rounded-lg">
                {surah.number}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {surah.name}
                  <span className="text-sm text-gray-500 ml-2 font-normal">
                    {surah.arabicName}
                  </span>
                </h4>
                <p className="text-sm text-gray-600">
                  {surah.verses} verzen • {surah.revelationType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.grade !== null && (
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      item.grade >= 8
                        ? 'text-success-600'
                        : item.grade >= 6
                        ? 'text-warning-600'
                        : 'text-error-600'
                    }`}
                  >
                    {item.grade}
                  </div>
                  <div className="text-xs text-gray-500">/ 10</div>
                </div>
              )}

              {item.completed ? (
                <Badge variant="success">Afgerond</Badge>
              ) : (
                <Badge variant="warning">In behandeling</Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
