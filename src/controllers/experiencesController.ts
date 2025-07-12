import { Request, Response } from 'express'
import Experiences from '../../models/experiences'
import { ExperiencesCreationAttributes } from '../interfaces/experiences.interface'
import { IUpdateRepositoryRequestBody } from '../interfaces/repository.interface'
import { ExperiencesType } from '../types/enums'
export class experiencesController {
  async createExperience(
    req: Request<{}, {}, ExperiencesCreationAttributes>,
    res: Response
  ): Promise<Response> {
    try {
      const {
        title,
        description,
        organization,
        location,
        mode,
        type,
        startDate,
        endDate,
      } = req.body

      const payload = {
        title,
        description,
        organization,
        location,
        mode,
        type,
        startDate,
        endDate,
      }

      const newExperience = await Experiences.create(payload)

      return res.status(201).json(newExperience)
    } catch (error) {
      console.error('Erro ao criar experiência:', error)
      return res.status(500).json({ message: 'Falha ao criar a experiência.' })
    }
  }
  async deleteExperience(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const id = req.params.id
      const affectedRows = await Experiences.destroy({ where: { id } })

      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Experiência não encontrada' })
      }

      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Falha ao deletar experiência' })
    }
  }

  async getExperience(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const id = req.params.id
      const experience = await Experiences.findOne({ where: { id } })
      if (!experience) {
        return res.status(404).json({ message: 'Experiência não encontrada' })
      }

      return res.status(200).json(experience)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Falha ao buscar experiência' })
    }
  }

  async updateExperience(
    req: Request<{ id: string }, {}, IUpdateRepositoryRequestBody>,
    res: Response
  ): Promise<Response> {
    try {
      const id = req.params.id
      const experienceToUpdate = await Experiences.findByPk(id)
      if (!experienceToUpdate) {
        return res.status(404).json({ message: 'Experiência não encontrada' })
      }
      await experienceToUpdate.update(req.body)
      return res.status(200).json(experienceToUpdate)
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({ message: 'Falha ao atualizar a experiência' })
    }
  }
  async getExperienceByType(
    req: Request<{}, {}, {}, { type?: ExperiencesType }>,
    res: Response
  ): Promise<Response> {
    try {
      const type = req.query.type
      console.log('🚀 ~ experiencesController ~ type:', type)
      const whereCondition: { type?: ExperiencesType } = {}

      if (type) {
        whereCondition.type = type
      }

      const experiences = await Experiences.findAll({
        where: whereCondition,
      })

      if (experiences.length === 0 && type) {
        return res.status(404).json({
          message: `Nenhuma experiência encontrada para o tipo: ${type}`,
        })
      }

      return res.status(200).json(experiences)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Falha ao buscar experience' })
    }
  }
}
