import { NextRequest, NextResponse } from 'next/server'
import { generateUploadUrl } from '@/lib/audio/s3'

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json()

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName en fileType zijn verplicht' },
        { status: 400 }
      )
    }

    // Valideer file type
    const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg']
    if (!allowedTypes.some((type) => fileType.startsWith(type))) {
      return NextResponse.json(
        { error: 'Ongeldig audio bestandstype' },
        { status: 400 }
      )
    }

    const { uploadUrl, fileUrl, key } = await generateUploadUrl(
      fileName,
      fileType
    )

    return NextResponse.json({
      uploadUrl,
      fileUrl,
      key,
    })
  } catch (error) {
    console.error('Upload URL error:', error)
    return NextResponse.json(
      { error: 'Kon upload URL niet genereren' },
      { status: 500 }
    )
  }
}
