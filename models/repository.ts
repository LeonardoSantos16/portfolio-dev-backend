import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize/db'; 
import Icon from './icon';  

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
  },
  {
    sequelize,  
    modelName: 'Repository', 
  }
);

Repository.belongsToMany(Icon, {
  through: 'RepositoryIcons',
  foreignKey: 'repositoryId',
  otherKey: 'iconId',
});

export default Repository;
