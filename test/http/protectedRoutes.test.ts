import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../../src/app'
import { createTokenService } from '../../src/auth/tokenService'
import { TEST_JWT_SECRET } from '../setup-env'
import { expiredToken } from '../helpers/tokens'

function tokenSignedWith(secret: string) {
  return createTokenService({ secret, expiresIn: '1h' }).sign()
}

function validToken() {
  return tokenSignedWith(TEST_JWT_SECRET)
}

describe('rotas de escrita protegidas', () => {
  it('POST /icon sem Authorization responde 401 com WWW-Authenticate: Bearer', async () => {
    const res = await request(app).post('/icon').send({ name: 'ts' })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'Não autorizado.' })
    expect(res.headers['www-authenticate']).toBe('Bearer')
  })

  it.each([
    ['esquema Basic', `Basic ${Buffer.from('admin:senha').toString('base64')}`],
    ['token sem esquema', validToken()],
    ['Bearer com token inválido', 'Bearer isto-nao-e-um-jwt'],
    ['Bearer com outro segredo', `Bearer ${tokenSignedWith('y'.repeat(40))}`],
    ['Bearer com token expirado', `Bearer ${expiredToken(TEST_JWT_SECRET)}`],
  ])('POST /icon com %s responde 401 genérico', async (_caso, authorization) => {
    const res = await request(app)
      .post('/icon')
      .set('Authorization', authorization)
      .send({ name: 'ts' })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'Não autorizado.' })
    expect(res.headers['www-authenticate']).toBe('Bearer')
  })

  it('POST /icon com Bearer válido chega ao controller', async () => {
    const res = await request(app)
      .post('/icon')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ name: 'ts' })

    expect(res.status).toBe(201)
  })

  const writeRoutes = [
    ['post', '/repository'],
    ['put', '/repository/1'],
    ['delete', '/repository/1'],
    ['post', '/experiences'],
    ['put', '/experiences/1'],
    ['delete', '/experiences/1'],
    ['post', '/icon'],
    ['put', '/icon/1'],
    ['delete', '/icon/1'],
    ['post', '/iconRepository'],
    ['delete', '/iconRepository'],
  ] as const

  it.each(writeRoutes)('%s %s sem token responde 401', async (method, path) => {
    const res = await request(app)[method](path)

    expect(res.status).toBe(401)
    expect(res.headers['www-authenticate']).toBe('Bearer')
  })

  it.each(writeRoutes)('%s %s com token válido não responde 401', async (method, path) => {
    const res = await request(app)[method](path).set('Authorization', `Bearer ${validToken()}`)

    expect(res.status).not.toBe(401)
  })

  it.each(['post', 'put'] as const)(
    '%s /repository sem token é rejeitado antes do processamento do upload',
    async (method) => {
      const path = method === 'post' ? '/repository' : '/repository/1'
      const res = await request(app)
        [method](path)
        .attach('image', Buffer.from('nao sou imagem'), {
          filename: 'x.txt',
          contentType: 'text/plain',
        })

      expect(res.status).toBe(401)
    }
  )
})

describe('rotas de leitura públicas', () => {
  it.each([
    '/repository',
    '/repository/highlighted',
    '/repository/1',
    '/experiences',
    '/experiences/1',
    '/icon',
    '/icon/1',
    '/iconRepository/1',
  ])('GET %s sem token não responde 401', async (path) => {
    const res = await request(app).get(path)

    expect(res.status).not.toBe(401)
  })
})
