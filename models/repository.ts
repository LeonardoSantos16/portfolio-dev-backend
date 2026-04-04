import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize/db";
import RepositoryIcons from "./repository-icons";
import { IRepositoryAttributes } from "../src/interfaces/repository.interface";
import { RepositoryCategory } from "../src/types/enums";

interface RepositoryCreationAttributes extends Optional<
  IRepositoryAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

class Repository
  extends Model<IRepositoryAttributes, RepositoryCreationAttributes>
  implements IRepositoryAttributes
{
  date!: Date;
  id!: number;
  title!: string;
  description!: string;
  linkDemo?: string | undefined;
  shortDescription?: string;
  linkGithub!: string;
  id_icon?: number | undefined;
  category!: RepositoryCategory;
  imageUrl?: string;
  highlighted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Repository.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    linkDemo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.STRING(130),
      allowNull: true,
    },
    linkGithub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    highlighted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        "WEB_DEVELOPMENT",
        "MOBILE_DEVELOPMENT",
        "BACKEND_SYSTEMS",
        "DATA_SCIENCE",
        "FULL_STACK",
      ),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Repository",
    tableName: "repositories",
    underscored: true,
  },
);

Repository.hasMany(RepositoryIcons, { foreignKey: "repositoryId" });
RepositoryIcons.belongsTo(Repository, { foreignKey: "repositoryId" });

export default Repository;
