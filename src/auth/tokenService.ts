import jwt, { SignOptions } from 'jsonwebtoken'

const ISSUER = 'portfolio-api'
const AUDIENCE = 'portfolio-admin'
const SUBJECT = 'admin'

interface TokenServiceConfig {
  secret: string
  expiresIn: string
}

export function createTokenService({ secret, expiresIn }: TokenServiceConfig) {
  return {
    sign(): string {
      return jwt.sign({}, secret, {
        algorithm: 'HS256',
        subject: SUBJECT,
        issuer: ISSUER,
        audience: AUDIENCE,
        expiresIn: expiresIn as SignOptions['expiresIn'],
      })
    },

    verify(token: string): { sub: string } | null {
      try {
        const payload = jwt.verify(token, secret, {
          algorithms: ['HS256'],
          issuer: ISSUER,
          audience: AUDIENCE,
          subject: SUBJECT,
        }) as jwt.JwtPayload & { sub: string }
        return { sub: payload.sub }
      } catch {
        return null
      }
    },
  }
}
