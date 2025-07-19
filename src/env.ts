import { z } from 'zod'

const envSchema = z.object({
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_SECRET_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
