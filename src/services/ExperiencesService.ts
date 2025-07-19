import Experiences from '../../models/experiences' // Ajuste o caminho para o seu modelo
import { ExperiencesCreationAttributes } from '../interfaces/experiences.interface' // Ajuste o caminho
import { ExperiencesType } from '../types/enums' // Ajuste o caminho

export class ExperiencesService {
  async create(data: ExperiencesCreationAttributes): Promise<Experiences> {
    const newExperience = await Experiences.create(data)
    if (!newExperience) {
      throw new Error('Falha ao criar a experiência.')
    }
    return newExperience
  }

  async delete(id: string): Promise<void> {
    const affectedRows = await Experiences.destroy({ where: { id } })
    if (affectedRows === 0) {
      throw new Error('Experience not found')
    }
  }

  async findById(id: string): Promise<Experiences | null> {
    const experience = await Experiences.findByPk(id)
    return experience
  }

  async update(
    id: string,
    data: Partial<ExperiencesCreationAttributes>
  ): Promise<Experiences> {
    const experience = await Experiences.findByPk(id)
    if (!experience) {
      throw new Error('Experience not found')
    }
    await experience.update(data)
    return experience
  }

  async findByType(type?: ExperiencesType): Promise<Experiences[]> {
    const whereCondition: { type?: ExperiencesType } = {}
    if (type) {
      whereCondition.type = type
    }
    const experiences = await Experiences.findAll({ where: whereCondition })
    return experiences
  }
}
