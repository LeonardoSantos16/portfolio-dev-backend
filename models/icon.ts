import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize/db';  
import RepositoryIcons from './repository-icons';

class Icon extends Model {}

Icon.init(
  {
    name_icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Icon',  
    timestamps: false,
  }
);

Icon.hasMany(RepositoryIcons, { foreignKey: 'iconId' });
RepositoryIcons.belongsTo(Icon, { foreignKey: 'iconId' });

export default Icon;