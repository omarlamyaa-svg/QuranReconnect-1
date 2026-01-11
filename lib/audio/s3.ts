import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  ...(process.env.AWS_ENDPOINT && { endpoint: process.env.AWS_ENDPOINT }),
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'quran-audio-submissions'

export async function generateUploadUrl(
  fileName: string,
  fileType: string
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
  const key = `submissions/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  })

  // URL geldig voor 5 minuten
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

  const fileUrl = process.env.AWS_ENDPOINT
    ? `${process.env.AWS_ENDPOINT}/${BUCKET_NAME}/${key}`
    : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return {
    uploadUrl,
    fileUrl,
    key,
  }
}

export async function generateDownloadUrl(key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  // URL geldig voor 1 uur
  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}
