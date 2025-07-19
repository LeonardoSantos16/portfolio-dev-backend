import { RepositoryCategory } from '../types/enums'

export interface ICreateRepositoryRequestBody {
  title: string
  date: string
  description: string
  linkDemo?: string
  linkGithub: string
  shortDescription?: string
  idIcon: number
  category: RepositoryCategory
  highlighted: boolean
}

export interface IRepositoryAttributes {
  id: string
  title: string
  description: string
  linkDemo?: string
  linkGithub: string
  shortDescription?: string
  date: Date
  id_icon?: number
  category: RepositoryCategory
  highlighted: boolean
  createdAt?: Date
  updatedAt?: Date
  imageUrl?: string
}

// TODO: estudar o tipo Partial
export type IUpdateRepositoryRequestBody = Partial<ICreateRepositoryRequestBody>
