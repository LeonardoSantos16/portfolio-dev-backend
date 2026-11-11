import { describe, it, expect } from 'vitest'
import { envSchema } from '../src/env'

const validEnv = {
  CLOUDFLARE_ENDPOINT: 'https://r2.example.com',
  CLOUDFLARE_ACCESS_KEY: 'k',
  CLOUDFLARE_SECRET_KEY: 's',
  CLOUDFLARE_PUBLIC_URL: 'https://cdn.example.com/',
  CLOUDFLARE_BUCKET_NAME: 'b',
  DATABASE_URL: 'postgres://u:p@localhost/db',
  JWT_SECRET: 'z'.repeat(32),
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD_HASH:
    '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5x6dJQb7jHZ2cS5b0p3l5lK1n5mWm3e',
}

describe('envSchema', () => {
  it('rejeita JWT_SECRET com menos de 32 caracteres', () => {
    const result = envSchema.safeParse({ ...validEnv, JWT_SECRET: 'z'.repeat(31) })

    expect(result.success).toBe(false)
  })

  it.each([undefined, 'senha-em-texto-puro', '$1$md5crypt$abc'])(
    'rejeita ADMIN_PASSWORD_HASH ausente ou fora do formato bcrypt: %s',
    (hash) => {
      const result = envSchema.safeParse({ ...validEnv, ADMIN_PASSWORD_HASH: hash })

      expect(result.success).toBe(false)
    }
  )

  it('aceita env válido e usa 1h como padrão para JWT_EXPIRES_IN', () => {
    const result = envSchema.safeParse(validEnv)

    expect(result.success).toBe(true)
    expect(result.data?.JWT_EXPIRES_IN).toBe('1h')
  })

  it.each([undefined, 'nao-e-email'])('rejeita ADMIN_EMAIL inválido: %s', (email) => {
    const result = envSchema.safeParse({ ...validEnv, ADMIN_EMAIL: email })

    expect(result.success).toBe(false)
  })
})
