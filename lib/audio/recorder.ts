export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null
  private startTime: number = 0
  private pausedDuration: number = 0
  private pauseStartTime: number = 0

  async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })
    } catch (error) {
      throw new Error('Microfoon toegang geweigerd')
    }
  }

  start(): void {
    if (!this.stream) {
      throw new Error('Audio recorder niet geïnitialiseerd')
    }

    this.audioChunks = []
    this.startTime = Date.now()
    this.pausedDuration = 0

    const options = {
      mimeType: this.getSupportedMimeType(),
      audioBitsPerSecond: 128000,
    }

    this.mediaRecorder = new MediaRecorder(this.stream, options)

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data)
      }
    }

    this.mediaRecorder.start(100) // Collect data every 100ms voor waveform
  }

  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      this.pauseStartTime = Date.now()
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.pausedDuration += Date.now() - this.pauseStartTime
      this.mediaRecorder.resume()
    }
  }

  async stop(): Promise<{ blob: Blob; duration: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Geen actieve opname'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, {
          type: this.getSupportedMimeType(),
        })
        const duration = Math.floor(
          (Date.now() - this.startTime - this.pausedDuration) / 1000
        )

        resolve({ blob, duration })
      }

      this.mediaRecorder.stop()
    })
  }

  getState(): 'inactive' | 'recording' | 'paused' {
    return this.mediaRecorder?.state ?? 'inactive'
  }

  getDuration(): number {
    if (!this.startTime) return 0

    const currentTime = Date.now()
    let totalDuration = currentTime - this.startTime - this.pausedDuration

    if (this.mediaRecorder?.state === 'paused') {
      totalDuration -= currentTime - this.pauseStartTime
    }

    return Math.floor(totalDuration / 1000)
  }

  cleanup(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    this.audioChunks = []
    this.mediaRecorder = null
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return 'audio/webm' // fallback
  }

  // Voor waveform visualisatie
  getAnalyser(): AnalyserNode | null {
    if (!this.stream) return null

    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(this.stream)
    const analyser = audioContext.createAnalyser()

    analyser.fftSize = 2048
    source.connect(analyser)

    return analyser
  }
}
