import { vi } from 'vitest'

// Dublê da fronteira com o banco: um model Sequelize "vazio" cujas consultas
// respondem sem tocar no Postgres.
export function fakeModel() {
  return {
    findByPk: vi.fn(async () => null),
    findAll: vi.fn(async () => []),
    findAndCountAll: vi.fn(async () => ({ count: 0, rows: [] })),
    create: vi.fn(async (data: object) => ({ id: 1, ...data })),
    update: vi.fn(async () => [1]),
    destroy: vi.fn(async () => 1),
  }
}

// Dublê da fronteira com o Cloudflare R2.
export class FakeR2Storage {
  uploadFile = vi.fn(async () => 'fake-key.png')
  deleteFile = vi.fn(async () => undefined)
}
