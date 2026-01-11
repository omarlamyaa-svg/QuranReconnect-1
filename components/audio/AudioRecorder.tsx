'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AudioRecorderService } from '@/lib/audio/recorder'
import { formatDuration } from '@/lib/audio/upload'
import { Button } from '@/components/ui/Button'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  maxDuration?: number
  showWaveform?: boolean
}

export function AudioRecorder({
  onRecordingComplete,
  maxDuration = 600, // 10 minuten default
  showWaveform = true,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<AudioRecorderService | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup bij unmount
      if (recorderRef.current) {
        recorderRef.current.cleanup()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)

      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorderService()
        await recorderRef.current.initialize()
      }

      recorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)

      // Start duration timer
      intervalRef.current = setInterval(() => {
        if (recorderRef.current) {
          const currentDuration = recorderRef.current.getDuration()
          setDuration(currentDuration)

          // Auto-stop bij max duration
          if (currentDuration >= maxDuration) {
            stopRecording()
          }
        }
      }, 100)

      // Start waveform visualisatie
      if (showWaveform) {
        drawWaveform()
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Kon opname niet starten'
      )
    }
  }

  const pauseRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.pause()
      setIsPaused(true)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.resume()
      setIsPaused(false)

      intervalRef.current = setInterval(() => {
        if (recorderRef.current) {
          const currentDuration = recorderRef.current.getDuration()
          setDuration(currentDuration)

          if (currentDuration >= maxDuration) {
            stopRecording()
          }
        }
      }, 100)
    }
  }

  const stopRecording = async () => {
    if (!recorderRef.current) return

    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      const { blob, duration: recordedDuration } =
        await recorderRef.current.stop()

      setIsRecording(false)
      setIsPaused(false)
      setDuration(0)

      onRecordingComplete(blob, recordedDuration)

      // Cleanup recorder
      recorderRef.current.cleanup()
      recorderRef.current = null
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Kon opname niet stoppen'
      )
    }
  }

  const cancelRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.cleanup()
      recorderRef.current = null
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setIsRecording(false)
    setIsPaused(false)
    setDuration(0)
  }

  const drawWaveform = () => {
    if (!canvasRef.current || !recorderRef.current) return

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext('2d')
    const analyser = recorderRef.current.getAnalyser()

    if (!canvasCtx || !analyser) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording || isPaused) return

      animationRef.current = requestAnimationFrame(draw)

      analyser.getByteTimeDomainData(dataArray)

      canvasCtx.fillStyle = 'rgb(243, 244, 246)'
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = 'rgb(59, 130, 246)'

      canvasCtx.beginPath()

      const sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2)
      canvasCtx.stroke()
    }

    draw()
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg text-error-700">
          {error}
        </div>
      )}

      {showWaveform && (
        <canvas
          ref={canvasRef}
          width={600}
          height={100}
          className="w-full h-24 bg-gray-100 rounded-lg"
        />
      )}

      <div className="flex items-center justify-between">
        <div className="text-2xl font-mono font-semibold text-gray-900">
          {formatDuration(duration)}
          <span className="text-sm text-gray-500 ml-2">
            / {formatDuration(maxDuration)}
          </span>
        </div>

        <div className="flex gap-2">
          {!isRecording ? (
            <Button onClick={startRecording} variant="primary">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              Start opname
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button onClick={pauseRecording} variant="secondary">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pauzeer
                </Button>
              ) : (
                <Button onClick={resumeRecording} variant="primary">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Hervat
                </Button>
              )}

              <Button onClick={stopRecording} variant="primary">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
                Stop
              </Button>

              <Button onClick={cancelRecording} variant="danger">
                Annuleer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        {!isRecording && 'Klik op "Start opname" om te beginnen'}
        {isRecording && !isPaused && 'Opname bezig...'}
        {isPaused && 'Opname gepauzeerd'}
      </div>
    </div>
  )
}
