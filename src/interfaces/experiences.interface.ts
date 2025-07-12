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
