import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize/db";
import RepositoryIcons from "./repository-icons";

class Icon extends Model {}

Icon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nameIcon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Icon",
    tableName: "icons",
    underscored: true,
    timestamps: false,
  },
);

Icon.hasMany(RepositoryIcons, { foreignKey: "iconId" });
RepositoryIcons.belongsTo(Icon, { foreignKey: "iconId" });

export default Icon;
