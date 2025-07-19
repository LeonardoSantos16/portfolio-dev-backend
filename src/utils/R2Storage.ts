import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '../lib/cloudflare'
import { env } from '../env'
import { randomUUID } from 'node:crypto'

interface FilePayload {
  originalname: string
  buffer: Buffer
  mimetype: string
}

export class R2Storage {
  async uploadFile(file: FilePayload): Promise<string> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new Error('Payload de arquivo inválido fornecido para upload.')
    }
    const fileName = `${randomUUID()}-${file.originalname}`

    const uploadCommand = new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    await r2.send(uploadCommand)

    return fileName
  }

  async deleteFile(key: string): Promise<void> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    })

    await r2.send(deleteCommand)
  }
}
