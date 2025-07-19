import { Request, Response } from 'express'
import { IconService } from '../services/IconService'
import { IconCreationAttributes } from '../interfaces/icon.interface'
import { CreateIconSchemaBody } from '../schemas/iconSchema'
export class IconController {
  private iconService = new IconService()

  createIcon = async (
    req: Request<{}, {}, CreateIconSchemaBody>,
    res: Response
  ): Promise<Response> => {
    try {
      const icon = await this.iconService.create(req.body)
      return res.status(201).json({ message: 'Icon criado com sucesso', icon })
    } catch (error: any) {
      console.error('Erro ao criar ícone:', error)
      return res
        .status(500)
        .json({ message: error.message || 'Falha ao criar o ícone.' })
    }
  }

  deleteIcon = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      await this.iconService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Icon not found') {
        return res.status(404).json({ message: 'Ícone não encontrado.' })
      }
      console.error('Erro ao deletar ícone:', error)
      return res.status(500).json({ message: 'Falha ao deletar o ícone.' })
    }
  }

  updateIcon = async (
    req: Request<{ id: string }, {}, Partial<IconCreationAttributes>>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const updatedIcon = await this.iconService.update(id, req.body)
      return res
        .status(200)
        .json({ message: 'Icon atualizado com sucesso', icon: updatedIcon })
    } catch (error: any) {
      if (error.message === 'Icon not found') {
        return res.status(404).json({ message: 'Ícone não encontrado.' })
      }
      console.error('Erro ao atualizar ícone:', error)
      return res.status(500).json({ message: 'Falha ao atualizar o ícone.' })
    }
  }

  getIcon = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params
      const icon = await this.iconService.findById(id)
      if (!icon) {
        return res.status(404).json({ message: 'Ícone não encontrado.' })
      }
      return res.status(200).json(icon)
    } catch (error) {
      console.error('Erro ao buscar ícone:', error)
      return res.status(500).json({ message: 'Falha ao buscar o ícone.' })
    }
  }

  getManyIcons = async (req: Request, res: Response): Promise<Response> => {
    try {
      const icons = await this.iconService.findAll()
      return res.status(200).json(icons)
    } catch (error) {
      console.error('Erro ao buscar ícones:', error)
      return res.status(500).json({ message: 'Falha ao buscar os ícones.' })
    }
  }
}
