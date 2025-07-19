import { Request, Response } from 'express'
import { ExperiencesService } from '../services/ExperiencesService' // Ajuste o caminho
import { ExperiencesCreationAttributes } from '../interfaces/experiences.interface'
import { ExperiencesType } from '../types/enums'
export class experiencesController {
  private experiencesService = new ExperiencesService()

  createExperience = async (
    req: Request<{}, {}, ExperiencesCreationAttributes>,
    res: Response
  ): Promise<Response> => {
    try {
      const newExperience = await this.experiencesService.create(req.body)
      return res.status(201).json(newExperience)
    } catch (error: any) {
      console.error('Erro ao criar experiência:', error)
      return res
        .status(500)
        .json({ message: error.message || 'Falha ao criar a experiência.' })
    }
  }

  deleteExperience = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      await this.experiencesService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Experience not found') {
        return res.status(404).json({ message: 'Experiência não encontrada.' })
      }
      console.error(error)
      return res.status(500).json({ message: 'Falha ao deletar experiência.' })
    }
  }

  getExperience = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const experience = await this.experiencesService.findById(id)
      if (!experience) {
        return res.status(404).json({ message: 'Experiência não encontrada.' })
      }
      return res.status(200).json(experience)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Falha ao buscar experiência.' })
    }
  }

  updateExperience = async (
    req: Request<{ id: string }, {}, Partial<ExperiencesCreationAttributes>>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const updatedExperience = await this.experiencesService.update(
        id,
        req.body
      )
      return res.status(200).json(updatedExperience)
    } catch (error: any) {
      if (error.message === 'Experience not found') {
        return res.status(404).json({ message: 'Experiência não encontrada.' })
      }
      console.error(error)
      return res
        .status(500)
        .json({ message: 'Falha ao atualizar a experiência.' })
    }
  }

  getExperienceByType = async (
    req: Request<{}, {}, {}, { type?: ExperiencesType }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { type } = req.query
      const experiences = await this.experiencesService.findByType(type)
      return res.status(200).json(experiences)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Falha ao buscar experiências.' })
    }
  }
}
