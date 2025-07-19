import { Request, Response } from 'express'
import { RepositoryIconService } from '../services/RepositoryIconService'
import { RepositoryIconCreationAttributes } from '../interfaces/repository-icons.interface'

export class IconsOfRepositoryController {
  private repositoryIconService = new RepositoryIconService()

  createIconRepository = async (
    req: Request<{}, {}, RepositoryIconCreationAttributes>,
    res: Response
  ): Promise<Response> => {
    try {
      await this.repositoryIconService.linkIconToRepository(req.body)
      return res.status(201).send()
    } catch (error: any) {
      console.error('Erro ao associar ícone:', error)
      return res
        .status(500)
        .json({ message: error.message || 'Falha ao associar ícone.' })
    }
  }

  deleteIconRepository = async (
    req: Request<{}, {}, RepositoryIconCreationAttributes>,
    res: Response
  ): Promise<Response> => {
    try {
      await this.repositoryIconService.unlinkIconFromRepository(req.body)
      return res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Association not found') {
        return res.status(404).json({ message: 'Associação não encontrada.' })
      }
      console.error('Erro ao desassociar ícone:', error)
      return res.status(500).json({ message: 'Falha ao desassociar ícone.' })
    }
  }

  getIconRepository = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const icons = await this.repositoryIconService.findIconsByRepositoryId(id)

      return res.status(200).json(icons)
    } catch (error) {
      console.error('Erro ao buscar ícones do repositório:', error)
      return res.status(500).json({ message: 'Falha ao buscar ícones.' })
    }
  }
}
