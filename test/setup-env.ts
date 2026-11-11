import bcrypt from 'bcryptjs'

export const TEST_ADMIN_EMAIL = 'admin@example.com'
export const TEST_ADMIN_PASSWORD = 'senha-de-teste-123'
export const TEST_JWT_SECRET = 'a'.repeat(32) + '-segredo-de-teste'

process.env.NODE_ENV = 'test'
// Simula o ambiente da Vercel (um proxy confiável) nas suítes HTTP.
process.env.VERCEL = '1'
process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/test'
process.env.CLOUDFLARE_ENDPOINT = 'https://r2.example.com'
process.env.CLOUDFLARE_ACCESS_KEY = 'test'
process.env.CLOUDFLARE_SECRET_KEY = 'test'
process.env.CLOUDFLARE_PUBLIC_URL = 'https://cdn.example.com/'
process.env.CLOUDFLARE_BUCKET_NAME = 'test'
process.env.JWT_SECRET = TEST_JWT_SECRET
process.env.ADMIN_EMAIL = TEST_ADMIN_EMAIL
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_ADMIN_PASSWORD, 4)
