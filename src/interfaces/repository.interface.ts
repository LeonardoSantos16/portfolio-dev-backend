import { RepositoryCategory } from '../types/enums'

export interface ICreateRepositoryRequestBody {
  title: string
  date: string
  description: string
  linkDemo?: string
  linkGithub: string
  idIcon: number
  category: RepositoryCategory
  highlighted: boolean
}

export interface IRepositoryAttributes {
  id: string
  title: string
  description: string
  link_demo?: string
  link_github: string
  date: Date
  id_icon?: number
  category: RepositoryCategory
  highlighted: boolean
  createdAt?: Date
  updatedAt?: Date
}

// TODO: estudar o tipo Partial
export type IUpdateRepositoryRequestBody = Partial<ICreateRepositoryRequestBody>
