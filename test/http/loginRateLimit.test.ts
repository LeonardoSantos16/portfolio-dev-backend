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

const ATTACKER_IP = '203.0.113.7'
const OTHER_IP = '198.51.100.9'

function loginFrom(ip: string, password = 'senha-errada') {
  return request(app)
    .post('/auth/login')
    .set('X-Forwarded-For', ip)
    .send({ email: TEST_ADMIN_EMAIL, password })
}

describe('rate limit do POST /auth/login', () => {
  it('bloqueia a 6ª tentativa do mesmo IP em 15 min, mesmo com a senha correta', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await loginFrom(ATTACKER_IP)).status).toBe(401)
    }

    const sixth = await loginFrom(ATTACKER_IP, TEST_ADMIN_PASSWORD)

    expect(sixth.status).toBe(429)
    expect(typeof sixth.body.message).toBe('string')
    expect(sixth.body.token).toBeUndefined()
  })

  it('não afeta outro IP', async () => {
    const res = await loginFrom(OTHER_IP, TEST_ADMIN_PASSWORD)

    expect(res.status).toBe(200)
  })

  it('não afeta as rotas GET públicas do IP bloqueado', async () => {
    const res = await request(app).get('/repository').set('X-Forwarded-For', ATTACKER_IP)

    expect(res.status).toBe(200)
  })
})
