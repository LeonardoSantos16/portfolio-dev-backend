import { z } from 'zod'

export const createIconSchema = z.object({
  nameIcon: z.string().min(1, 'name_icon é obrigatório'),
  name: z.string().optional(),
  color: z.string().optional(),
})

export type CreateIconSchemaBody = z.infer<typeof createIconSchema>
