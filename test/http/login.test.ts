import { describe, it, expect } from 'vitest'
import request from 'supertest'

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
    ['corpo vazio', {}, 'E-mail é obrigatório.'],
    ['e-mail que não é string', { email: 42, password: TEST_ADMIN_PASSWORD }, 'E-mail é obrigatório.'],
    ['e-mail inválido', { email: 'nao-e-email', password: TEST_ADMIN_PASSWORD }, 'E-mail inválido.'],
    ['senha ausente', { email: TEST_ADMIN_EMAIL }, 'Senha é obrigatória.'],
    ['senha vazia', { email: TEST_ADMIN_EMAIL, password: '' }, 'Senha é obrigatória.'],
    ['senha que não é string', { email: TEST_ADMIN_EMAIL, password: 12345 }, 'Senha é obrigatória.'],
  ])('com %s responde 400 em português', async (_caso, body, message) => {
    const res = await login().send(body)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message })
  })
})
