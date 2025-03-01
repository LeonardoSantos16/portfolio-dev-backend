import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize/db';  

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

export default Icon;