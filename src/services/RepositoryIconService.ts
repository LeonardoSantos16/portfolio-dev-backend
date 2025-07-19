import Icon from '../../models/icon'
import RepositoryIcons from '../../models/repository-icons'
import { RepositoryIconCreationAttributes } from '../interfaces/repository-icons.interface' // Crie esta interface

export class RepositoryIconService {
  async linkIconToRepository(
    data: RepositoryIconCreationAttributes
  ): Promise<RepositoryIcons> {
    const { iconId, repositoryId } = data
    const newLink = await RepositoryIcons.create({ iconId, repositoryId })

    if (!newLink) {
      throw new Error('Falha ao associar o ícone ao repositório.')
    }
    return newLink
  }

  async unlinkIconFromRepository(
    data: RepositoryIconCreationAttributes
  ): Promise<void> {
    const { iconId, repositoryId } = data
    const affectedRows = await RepositoryIcons.destroy({
      where: { iconId, repositoryId },
    })

    if (affectedRows === 0) {
      throw new Error('Association not found')
    }
  }

  async findIconsByRepositoryId(repositoryId: string): Promise<Icon[]> {
    const links = await RepositoryIcons.findAll({
      where: { repositoryId },
      attributes: ['iconId'],
    })

    if (links.length === 0) {
      return []
    }

    const iconIds = links.map((link) => link.toJSON().iconId)

    const icons = await Icon.findAll({
      where: {
        id: iconIds,
      },
    })

    return icons
  }
}
