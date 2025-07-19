import Repository from '../../models/repository'
import { R2Storage } from '../utils/R2Storage'
import { env } from '../env'
import {
  ICreateRepositoryRequestBody,
  IUpdateRepositoryRequestBody,
} from '../interfaces/repository.interface'
import { RepositoryCategory } from '../types/enums'

export class RepositoryService {
  private r2Storage = new R2Storage()

  private buildFullImageUrl(key: string): string {
    return `${env.CLOUDFLARE_PUBLIC_URL}${key}`
  }

  async create(data: ICreateRepositoryRequestBody, file: Express.Multer.File) {
    if (data.shortDescription && data.shortDescription.length > 130) {
      throw new Error('A descrição curta não pode exceder 130 caracteres.')
    }
    const fileName = await this.r2Storage.uploadFile(file)

    const repository = await Repository.create({
      ...data,
      date: new Date(data.date),
      imageUrl: fileName,
    })

    if (!repository) {
      throw new Error('Falha ao criar o repositório ')
    }

    return repository
  }

  async update(
    id: string,
    data: IUpdateRepositoryRequestBody,
    file?: Express.Multer.File
  ) {
    const repository = await Repository.findByPk(id)
    if (!repository) {
      throw new Error('Repository not found')
    }

    const dataToUpdate: { [key: string]: any } = { ...data }
    const oldImageKey = repository.imageUrl

    if (file) {
      const newImageKey = await this.r2Storage.uploadFile(file)
      dataToUpdate.imageUrl = newImageKey
    }

    const [rowsAffected] = await Repository.update(dataToUpdate, {
      where: { id },
    })

    if (file && oldImageKey) {
      await this.r2Storage.deleteFile(oldImageKey)
    }

    return await Repository.findByPk(id)
  }

  async delete(id: string) {
    const repository = await Repository.findByPk(id)
    if (!repository) {
      throw new Error('Repository not found')
    }

    if (repository.imageUrl) {
      await this.r2Storage.deleteFile(repository.imageUrl)
    }

    await Repository.destroy({ where: { id } })
  }

  async findById(id: string) {
    const repository = await Repository.findByPk(id)
    if (!repository) return null

    if (repository.imageUrl) {
      const imageUrl = repository.imageUrl
      const imageDomainUrl = this.buildFullImageUrl(imageUrl)
      repository.imageUrl = imageDomainUrl
    }
    return repository
  }

  async findMany(query: {
    category?: RepositoryCategory
    limit?: string
    page?: string
  }) {
    const { category } = query
    const whereCondition: { category?: RepositoryCategory } = {}
    if (category) {
      whereCondition.category = category
    }

    const page = parseInt(query.page || '1', 10)
    const limit = parseInt(query.limit || '6', 10)
    const offset = (page - 1) * limit

    const { count, rows } = await Repository.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [['date', 'DESC']],
    })

    if (!rows) {
      throw new Error('Erro ao buscar repositórios.')
    }
    const repositories = rows.map((repo) => {
      const plainRepo = repo.toJSON()
      if (plainRepo.imageUrl) {
        plainRepo.imageUrl = this.buildFullImageUrl(plainRepo.imageUrl)
      }
      return plainRepo
    })

    return { totalItems: count, repositories }
  }

  async findHighlighted() {
    const highlighted = await Repository.findAll({
      where: { highlighted: true },
    })

    return highlighted.map((repo) => {
      const plainRepo = repo.toJSON()
      if (plainRepo.imageUrl) {
        plainRepo.imageUrl = this.buildFullImageUrl(plainRepo.imageUrl)
      }
      return plainRepo
    })
  }
}
