import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'

vi.mock('../../models/icon', async () => ({
  default: (await import('../helpers/boundaries')).fakeModel(),
}))
vi.mock('../../models/repository', async () => ({
  default: (await import('../helpers/boundaries')).fakeModel(),
}))
vi.mock('../../models/repository-icons', async () => ({
  default: (await import('../helpers/boundaries')).fakeModel(),
}))
vi.mock('../../models/experiences', async () => ({
  default: (await import('../helpers/boundaries')).fakeModel(),
}))
vi.mock('../../src/utils/R2Storage', async () => ({
  R2Storage: (await import('../helpers/boundaries')).FakeR2Storage,
}))

import app from '../../src/app'
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../setup-env'

// Cada chamada usa um IP distinto (via proxy confiável) para não esbarrar no rate limit.
let ipCounter = 0
function login() {
  ipCounter += 1
  return request(app).post('/auth/login').set('X-Forwarded-For', `10.0.0.${ipCounter}`)
}

describe('POST /auth/login', () => {
  it('com credenciais válidas devolve um token que abre rotas protegidas', async () => {
    const loginRes = await login()
      .send({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD })

    expect(loginRes.status).toBe(200)
    expect(loginRes.body.expiresIn).toBe('1h')

    const write = await request(app)
      .post('/icon')
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send({ name: 'ts' })
    expect(write.status).toBe(201)
  })

  it('aceita o e-mail do admin com caixa e espaços diferentes', async () => {
    const res = await login()
      .send({ email: `  ${TEST_ADMIN_EMAIL.toUpperCase()} `, password: TEST_ADMIN_PASSWORD })

    expect(res.status).toBe(200)
  })

  it.each([
    ['senha errada', { email: TEST_ADMIN_EMAIL, password: 'senha-errada' }],
    ['e-mail desconhecido', { email: 'intruso@example.com', password: TEST_ADMIN_PASSWORD }],
  ])('com %s responde 401 genérico sem token', async (_caso, body) => {
    const res = await login().send(body)

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'Credenciais inválidas.' })
  })

  it.each([
    ['corpo vazio', {}],
    ['e-mail inválido', { email: 'nao-e-email', password: TEST_ADMIN_PASSWORD }],
    ['senha vazia', { email: TEST_ADMIN_EMAIL, password: '' }],
    ['senha que não é string', { email: TEST_ADMIN_EMAIL, password: 12345 }],
  ])('com %s responde 400', async (_caso, body) => {
    const res = await login().send(body)

    expect(res.status).toBe(400)
    expect(typeof res.body.message).toBe('string')
  })
})
