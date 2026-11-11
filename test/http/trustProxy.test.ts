import { describe, it, expect, vi, beforeAll } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { TEST_ADMIN_EMAIL } from '../setup-env'

// Fora da Vercel não há proxy confiável na frente da API: o X-Forwarded-For
// vem do próprio cliente e não pode ser usado para identificar o IP.
describe('fora da Vercel (sem proxy confiável)', () => {
  let app: Express

  beforeAll(async () => {
    vi.stubEnv('VERCEL', undefined)
    vi.resetModules()
    app = (await import('../../src/app')).default
  })

  it('X-Forwarded-For forjado não burla o rate limit do login', async () => {
    const statuses: number[] = []
    for (let i = 1; i <= 6; i++) {
      const res = await request(app)
        .post('/auth/login')
        .set('X-Forwarded-For', `10.9.9.${i}`)
        .send({ email: TEST_ADMIN_EMAIL, password: 'senha-errada' })
      statuses.push(res.status)
    }

    expect(statuses).toEqual([401, 401, 401, 401, 401, 429])
  })
})
