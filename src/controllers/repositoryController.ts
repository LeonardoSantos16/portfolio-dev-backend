import Repository from '../../models/repository'
import {
  ICreateRepositoryRequestBody,
  IUpdateRepositoryRequestBody,
} from '../interfaces/repository.interface'
import { RepositoryCategory } from '../types/enums'
import { Request, Response } from 'express'

export class RepositoryController {
  createRepository = async (
    req: Request<{}, {}, ICreateRepositoryRequestBody>,
    res: Response
  ): Promise<Response> => {
    try {
      const {
        title,
        date,
        description,
        linkDemo,
        linkGithub,
        category,
        shortDescription,
        highlighted,
        idIcon,
      } = req.body
      console.log(
        '🚀 ~ RepositoryController ~ shortDescription:',
        shortDescription
      )

      if (!(Object.values(RepositoryCategory) as string[]).includes(category)) {
        return res.status(400).json({ message: 'Invalid category provided.' })
      }

      if (shortDescription && shortDescription.length > 130) {
        return res.status(400).json({
          message: 'A descrição curta não pode exceder 130 caracteres.',
        })
      }

      const repository = await Repository.create({
        title,
        date: new Date(date),
        description,
        category,
        shortDescription,
        highlighted,
        linkDemo: linkDemo,
        linkGithub: linkGithub,
        id_icon: idIcon,
      })

      if (!repository) {
        return res.status(500).json({ message: 'Failed to create repository.' })
      }

      return res
        .status(201)
        .json({ message: 'Repositório criado com sucesso', repository })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  deleteRepository = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const repositoryDeleted = await Repository.destroy({
        where: {
          id,
        },
      })

      if (repositoryDeleted) {
        return res.status(204).send()
      }
      return res
        .status(404)
        .json({ message: 'Repositório não encontrado para exclusão.' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  updateRepository = async (
    req: Request<{ id: string }, {}, IUpdateRepositoryRequestBody>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const {
        title,
        date,
        description,
        highlighted,
        linkDemo,
        shortDescription,
        category,
        linkGithub,
        idIcon,
      } = req.body

      if (
        category &&
        !(Object.values(RepositoryCategory) as string[]).includes(category)
      ) {
        return res.status(400).json({ message: 'Invalid category provided.' })
      }

      const [rowsAffected] = await Repository.update(
        {
          title,
          date: date ? new Date(date) : undefined,
          description,
          highlighted,
          shortDescription,
          category,
          linkDemo,
          linkGithub,
          id_icon: idIcon,
        },
        {
          where: {
            id,
          },
        }
      )

      if (rowsAffected === 0) {
        return res
          .status(404)
          .json({ message: 'Repositório não encontrado para atualização.' })
      }

      const updatedRepository = await Repository.findByPk(id)
      return res.status(200).json({
        message: 'Repositório atualizado com sucesso',
        repository: updatedRepository,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  getRepository = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const repository = await Repository.findOne({ where: { id } })

      if (!repository) {
        return res.status(404).json({ message: 'Repositório não encontrado.' })
      }
      return res.status(200).json(repository)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  getManyRepository = async (
    req: Request<{}, {}, {}, { category?: RepositoryCategory }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { category } = req.query
      const whereCondition: { category?: RepositoryCategory } = {}

      if (category) {
        whereCondition.category = category
      }

      const allRepositories = await Repository.findAll({
        where: whereCondition,
      })

      if (!allRepositories) {
        return res.status(500).json({ message: 'Erro ao buscar repositórios.' })
      }

      return res.status(200).json(allRepositories)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }
}
