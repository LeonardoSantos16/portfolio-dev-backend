import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize/db'
import { IExperiencesAttributes } from '../src/interfaces/experiences.interface'
import { ExperiencesType } from '../src/types/enums'

class Experiences
  extends Model<IExperiencesAttributes>
  implements IExperiencesAttributes
{
  id!: number
  title!: string
  description!: string
  startDate!: Date
  organization!: string
  location!: string
  endDate!: Date
  mode!: string
  type!: ExperiencesType
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Experiences.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('WORK', 'EDUCATION'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Experiences',
    tableName: 'Experiences',
    timestamps: true,
    underscored: true,
  }
)
