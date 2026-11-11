import { vi } from 'vitest'

// Fronteiras externas substituídas em todas as suítes: banco (models Sequelize)
// e Cloudflare R2. Ao criar um model novo, adicione-o aqui.
vi.mock('../models/icon', async () => ({
  default: (await import('./helpers/boundaries')).fakeModel(),
}))
vi.mock('../models/repository', async () => ({
  default: (await import('./helpers/boundaries')).fakeModel(),
}))
vi.mock('../models/repository-icons', async () => ({
  default: (await import('./helpers/boundaries')).fakeModel(),
}))
vi.mock('../models/experiences', async () => ({
  default: (await import('./helpers/boundaries')).fakeModel(),
}))
vi.mock('../src/utils/R2Storage', async () => ({
  R2Storage: (await import('./helpers/boundaries')).FakeR2Storage,
}))
