import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../sequelize/db'
import RepositoryIcons from './repository-icons'
import { IRepositoryAttributes } from '../src/interfaces/repository.interface'
import { RepositoryCategory } from '../src/types/enums'

interface RepositoryCreationAttributes
  extends Optional<IRepositoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Repository
  extends Model<IRepositoryAttributes, RepositoryCreationAttributes>
  implements IRepositoryAttributes
{
  date!: Date
  id!: string
  title!: string
  description!: string
  linkDemo?: string | undefined
  shortDescription?: string
  linkGithub!: string
  id_icon?: number | undefined
  category!: RepositoryCategory
  highlighted!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
Repository.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linkDemo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'link_demo',
    },
    shortDescription: {
      type: DataTypes.STRING(130),
      allowNull: true,
      field: 'short_description',
    },
    linkGithub: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'link_github',
    },
    highlighted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'WEB_DEVELOPMENT',
        'MOBILE_DEVELOPMENT',
        'BACKEND_SYSTEMS',
        'DATA_SCIENCE',
        'FULL_STACK'
      ),
      allowNull: true,
    },
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'Repository',
  }
)

Repository.hasMany(RepositoryIcons, { foreignKey: 'repositoryId' })
RepositoryIcons.belongsTo(Repository, { foreignKey: 'repositoryId' })

export default Repository
