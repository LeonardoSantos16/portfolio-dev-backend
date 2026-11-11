import jwt from 'jsonwebtoken'

// Token com as claims corretas, mas já expirado.
export function expiredToken(secret: string) {
  return jwt.sign({ exp: Math.floor(Date.now() / 1000) - 60 }, secret, {
    algorithm: 'HS256',
    subject: 'admin',
    issuer: 'portfolio-api',
    audience: 'portfolio-admin',
  })
}
