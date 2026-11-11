import { z } from "zod";

export const envSchema = z.object({
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_SECRET_KEY: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  // Sempre com unidade: o jsonwebtoken lê "3600" como milissegundos.
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^[1-9]\d*[smhd]$/, "Use um número com unidade: s, m, h ou d (ex.: 1h)")
    .default("1h"),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/, "Hash bcrypt inválido"),
});

export const env = envSchema.parse(process.env);
