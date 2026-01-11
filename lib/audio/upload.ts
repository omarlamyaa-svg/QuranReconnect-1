import type { UploadUrlResponse } from '@/types'

export async function getUploadUrl(
  fileName: string,
  fileType: string
): Promise<UploadUrlResponse> {
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName, fileType }),
  })

  if (!response.ok) {
    throw new Error('Failed to get upload URL')
  }

  return response.json()
}

export async function uploadToS3(
  uploadUrl: string,
  file: Blob,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100
        onProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'))
    })

    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.send(file)
  })
}

export async function uploadAudio(
  audioBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now()
  const fileName = `audio-${timestamp}.webm`
  const fileType = audioBlob.type

  // Haal signed upload URL op
  const { uploadUrl, fileUrl } = await getUploadUrl(fileName, fileType)

  // Upload naar S3
  await uploadToS3(uploadUrl, audioBlob, onProgress)

  return fileUrl
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
