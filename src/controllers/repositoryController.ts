import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import Repository from '../../models/repository'
import { env } from '../env'
import {
  ICreateRepositoryRequestBody,
  IUpdateRepositoryRequestBody,
} from '../interfaces/repository.interface'
import { RepositoryCategory } from '../types/enums'
import { Request, Response } from 'express'
import { r2 } from '../lib/cloudflare'
import { randomUUID } from 'node:crypto'
import { RepositoryService } from '../services/RepositoryService'
export class RepositoryController {
  private repositoryService = new RepositoryService()
  createRepository = async (
    req: Request<{}, {}, ICreateRepositoryRequestBody>,
    res: Response
  ): Promise<Response> => {
    try {
      const newRepository = req.body

      const file = req.file

      if (!file) {
        return res.status(400).send('Nenhum arquivo enviado')
      }

      if (
        !(Object.values(RepositoryCategory) as string[]).includes(
          newRepository.category
        )
      ) {
        return res.status(400).json({ message: 'Tipo de categoria inválido' })
      }
      const repository = await this.repositoryService.create(
        newRepository,
        file
      )
      return res
        .status(201)
        .json({ message: 'Repositório criado com sucesso', repository })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  deleteRepository = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params
      await this.repositoryService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Repository not found') {
        return res.status(404).json({ message: 'Repositório não encontrado.' })
      }
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  updateRepository = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params
      const updatedRepository = await this.repositoryService.update(
        id,
        req.body,
        req.file
      )
      if (!updatedRepository) {
        return res.status(404).json({ message: 'Repositório não encontrado.' })
      }
      return res.status(200).json({
        message: 'Repositório atualizado com sucesso',
        repository: updatedRepository,
      })
    } catch (error: any) {
      if (error.message === 'Repository not found') {
        return res.status(404).json({ message: 'Repositório não encontrado.' })
      }
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }

  getRepository = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params
      const repository = await this.repositoryService.findById(id)
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
    req: Request<
      {},
      {},
      {},
      { category?: RepositoryCategory; limit?: string; page?: string }
    >,
    res: Response
  ): Promise<Response> => {
    try {
      const repositories = await this.repositoryService.findMany(req.query)

      return res.status(200).json({
        repository: repositories.repositories,
        totalItems: repositories.totalItems,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }
  getHighlightedRepository = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const highlighted = await this.repositoryService.findHighlighted()
      return res.status(200).json(highlighted)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }
}
