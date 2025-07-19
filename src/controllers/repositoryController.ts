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

      const file = req.file

      if (!file) {
        return res.status(400).send('Nenhum arquivo enviado')
      }

      if (!(Object.values(RepositoryCategory) as string[]).includes(category)) {
        return res.status(400).json({ message: 'Invalid category provided.' })
      }

      if (shortDescription && shortDescription.length > 130) {
        return res.status(400).json({
          message: 'A descrição curta não pode exceder 130 caracteres.',
        })
      }

      const fileName = `${randomUUID()}-${file.originalname}`

      const commandUpload = new PutObjectCommand({
        Bucket: 'portfolio2025',
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      })

      try {
        await r2.send(commandUpload)
      } catch (error) {
        console.error('Erro no upload', error)
        return res.status(500).send('Erro ao fazer upload do arquivo.')
      }

      const repository = await Repository.create({
        title,
        date: new Date(date),
        description,
        category,
        shortDescription,
        imageUrl: fileName,
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

      const repository = await Repository.findByPk(id)

      if (!repository) {
        return res.status(404).json({ message: 'Repositório não encontrado.' })
      }

      const imageKey = repository.imageUrl

      const repositoryDeleted = await Repository.destroy({
        where: {
          id,
        },
      })

      const deleteCommand = new DeleteObjectCommand({
        Bucket: 'portfolio2025',
        Key: imageKey,
      })

      await r2.send(deleteCommand)

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
      const body = req.body
      const newFile = req.file
      console.log('🚀 ~ RepositoryController ~  req.body:', req.body)
      console.log('🚀 ~ RepositoryController ~ req.file:', req.file)

      const repository = await Repository.findByPk(id)
      if (!repository) {
        return res.status(404).json({ message: 'Repositório não encontrado.' })
      }

      const dataToUpdate: { [key: string]: any } = {}

      const fieldsToUpdate: (keyof IUpdateRepositoryRequestBody)[] = [
        'title',
        'date',
        'description',
        'highlighted',
        'linkDemo',
        'shortDescription',
        'category',
        'linkGithub',
        'idIcon',
      ]

      fieldsToUpdate.forEach((field) => {
        if (body[field] !== undefined) {
          dataToUpdate[field] = body[field]
        }
      })

      const oldImageKey = repository.imageUrl
      console.log('🚀 ~ RepositoryController ~ oldImageKey:', oldImageKey)

      if (newFile) {
        const newImageKey = `${randomUUID()}-${newFile.originalname}`

        const uploadCommand = new PutObjectCommand({
          Bucket: 'portfolio2025',
          Key: newImageKey,
          Body: newFile.buffer,
          ContentType: newFile.mimetype,
        })
        await r2.send(uploadCommand)

        dataToUpdate.imageUrl = newImageKey
      }

      const [rowsAffected] = await Repository.update(dataToUpdate, {
        where: { id },
      })

      if (rowsAffected === 0) {
        return res
          .status(404)
          .json({ message: 'Repositório não encontrado para atualização.' })
      }

      if (newFile && oldImageKey) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: 'portfolio2025',
          Key: oldImageKey,
        })
        console.log(
          '🚀 ~ RepositoryController ~ newFile && oldImageKey:',
          newFile && oldImageKey
        )

        await r2.send(deleteCommand)
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
      const imageUrl = repository.imageUrl
      const imageDomainUrl = `${env.CLOUDFLARE_PUBLIC_URL}${imageUrl}`
      repository.imageUrl = imageDomainUrl
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
      const { category } = req.query
      const whereCondition: { category?: RepositoryCategory } = {}

      if (category) {
        whereCondition.category = category
      }
      const page = parseInt(req.query.page || '1', 10)
      const limit = parseInt(req.query.limit || '6', 10)
      const offset = (page - 1) * limit

      const { count, rows } = await Repository.findAndCountAll({
        where: whereCondition,
        limit: limit,
        offset: offset,
        order: [['date', 'DESC']],
      })

      if (!rows) {
        return res.status(500).json({ message: 'Erro ao buscar repositórios.' })
      }
      const repositoriesWithFullUrl = rows.map((repositoryInstance) => {
        const repositoryObject = repositoryInstance.toJSON()
        return {
          ...repositoryObject,
          imageUrl: `${env.CLOUDFLARE_PUBLIC_URL}${repositoryObject.imageUrl}`,
        }
      })

      return res
        .status(200)
        .json({ repository: repositoriesWithFullUrl, totalItems: count })
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
      const highlighted = await Repository.findAll({
        where: { highlighted: true },
      })

      if (!highlighted) {
        return res
          .status(404)
          .json({ message: 'Repositório com highlighted não encontrado.' })
      }
      return res.status(200).json(highlighted)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.' })
    }
  }
}
