import Icon from '../../models/icon'
import { IconCreationAttributes } from '../interfaces/icon.interface'
import { CreateIconSchemaBody } from '../schemas/iconSchema'
export class IconService {
  async create(data: CreateIconSchemaBody): Promise<Icon> {
    const icon = await Icon.create(data)
    if (!icon) {
      throw new Error('Falha ao criar o ícone.')
    }
    return icon
  }

  async delete(id: string): Promise<void> {
    const affectedRows = await Icon.destroy({ where: { id } })
    if (affectedRows === 0) {
      throw new Error('Icon not found')
    }
  }

  async update(
    id: string,
    data: Partial<IconCreationAttributes>
  ): Promise<Icon> {
    const icon = await Icon.findByPk(id)
    if (!icon) {
      throw new Error('Icon not found')
    }
    await icon.update(data)
    return icon
  }

  async findById(id: string): Promise<Icon | null> {
    return await Icon.findByPk(id)
  }

  async findAll(): Promise<Icon[]> {
    return await Icon.findAll()
  }
}
