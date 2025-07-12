import { Optional } from 'sequelize'
import { ExperiencesType } from '../types/enums'

export interface IExperiencesAttributes {
  id: number
  title: string
  description: string
  startDate: Date
  organization: string
  location: string
  endDate: Date
  mode: string
  type: ExperiencesType
}

export type IUpdateExperienceRequestBody = Partial<IExperiencesAttributes>

export interface ExperiencesCreationAttributes
  extends Optional<IExperiencesAttributes, 'id'> {}
