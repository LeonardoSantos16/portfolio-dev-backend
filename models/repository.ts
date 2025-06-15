import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize/db";
import Icon from "./icon";
import RepositoryIcons from "./repository-icons";
class Repository extends Model {}

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
    link_demo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link_github: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    highlighted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        "WEB_DEVELOPMENT",
        "MOBILE_DEVELOPMENT",
        "BACKEND_SYSTEMS",
        "DATA_SCIENCE",
        "FULL_STACK"
      ),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Repository",
  }
);

Repository.hasMany(RepositoryIcons, { foreignKey: "repositoryId" });
RepositoryIcons.belongsTo(Repository, { foreignKey: "repositoryId" });

export default Repository;
