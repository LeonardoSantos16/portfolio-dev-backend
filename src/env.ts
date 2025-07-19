import { z } from 'zod'

const envSchema = z.object({
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_SECRET_KEY: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
})

export const env = envSchema.parse(process.env)
