import { z } from 'zod'
import { RepositoryCategory } from '../types/enums'

export const createRepositorySchema = z.object({
  title: z.string().min(1, 'Titulo é obrigatório'),
  category: z.enum(RepositoryCategory),
  shortDescription: z
    .string()
    .max(130, 'A descrição curta não pode exceder 130 caracteres.'),
  imageUrl: z.string(),
  highlighted: z.boolean(),
  linkGithub: z.string().min(1, 'link do github é obrigatório'),
  linkDemo: z.string().optional(),
  date: z.string(),
  description: z.string(),
  idIcon: z.number(),
})

export type CreateRepositoryBody = z.infer<typeof createRepositorySchema>
