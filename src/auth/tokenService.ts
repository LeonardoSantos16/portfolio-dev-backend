import jwt, { SignOptions } from 'jsonwebtoken'

const ISSUER = 'portfolio-api'
const AUDIENCE = 'portfolio-admin'

interface TokenServiceConfig {
  secret: string
  expiresIn: string
}

export function createTokenService({ secret, expiresIn }: TokenServiceConfig) {
  return {
    sign(): string {
      return jwt.sign({}, secret, {
        algorithm: 'HS256',
        subject: 'admin',
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
        }) as jwt.JwtPayload
        return { sub: payload.sub as string }
      } catch {
        return null
      }
    },
  }
}
