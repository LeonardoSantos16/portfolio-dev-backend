import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { createTokenService } from '../../src/auth/tokenService'

const SECRET = 'x'.repeat(40)

describe('tokenService', () => {
  it('emite um JWT HS256 com sub, iss, aud, iat e exp de 1h', () => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })

    const token = tokens.sign()

    const decoded = jwt.decode(token, { complete: true }) as jwt.Jwt
    const payload = decoded.payload as jwt.JwtPayload
    expect(decoded.header.alg).toBe('HS256')
    expect(payload.sub).toBe('admin')
    expect(payload.iss).toBe('portfolio-api')
    expect(payload.aud).toBe('portfolio-admin')
    expect(payload.exp! - payload.iat!).toBe(3600)
  })

  it('verifica um token válido emitido por ele mesmo', () => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })

    expect(tokens.verify(tokens.sign())).toEqual({ sub: 'admin' })
  })

  it('rejeita token expirado', () => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })
    const expired = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) - 60 },
      SECRET,
      { algorithm: 'HS256', subject: 'admin', issuer: 'portfolio-api', audience: 'portfolio-admin' }
    )

    expect(tokens.verify(expired)).toBeNull()
  })

  it('rejeita token assinado com outro segredo', () => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })
    const other = createTokenService({ secret: 'y'.repeat(40), expiresIn: '1h' })

    expect(tokens.verify(other.sign())).toBeNull()
  })

  it('rejeita token malformado sem lançar erro', () => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })

    expect(tokens.verify('isto-nao-e-um-jwt')).toBeNull()
  })

  it('rejeita token assinado com algoritmo diferente de HS256', () => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })
    const hs512 = jwt.sign({}, SECRET, {
      algorithm: 'HS512',
      subject: 'admin',
      issuer: 'portfolio-api',
      audience: 'portfolio-admin',
      expiresIn: '1h',
    })

    expect(tokens.verify(hs512)).toBeNull()
  })

  it('rejeita token com alg none', () => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })
    const unsigned = jwt.sign({}, null as unknown as string, {
      algorithm: 'none',
      subject: 'admin',
      issuer: 'portfolio-api',
      audience: 'portfolio-admin',
      expiresIn: '1h',
    })

    expect(tokens.verify(unsigned)).toBeNull()
  })

  it.each([
    { issuer: 'outro-emissor', audience: 'portfolio-admin' },
    { issuer: 'portfolio-api', audience: 'outra-audiencia' },
  ])('rejeita token com iss/aud incorretos: %o', ({ issuer, audience }) => {
    const tokens = createTokenService({ secret: SECRET, expiresIn: '1h' })
    const foreign = jwt.sign({}, SECRET, {
      algorithm: 'HS256',
      subject: 'admin',
      issuer,
      audience,
      expiresIn: '1h',
    })

    expect(tokens.verify(foreign)).toBeNull()
  })
})
