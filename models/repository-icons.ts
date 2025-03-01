import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize/db';

class RepositoryIcons extends Model {}

RepositoryIcons.init(
    {
        iconId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        repositoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: 'RepositoryIcons'
    }
)
export default RepositoryIcons;
