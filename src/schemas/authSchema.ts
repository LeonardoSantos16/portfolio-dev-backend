import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string({ error: 'E-mail é obrigatório.' }).trim().email('E-mail inválido.'),
  password: z.string({ error: 'Senha é obrigatória.' }).min(1, 'Senha é obrigatória.'),
})

export type LoginBody = z.infer<typeof loginSchema>
