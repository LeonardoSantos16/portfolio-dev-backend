import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize/db';

class RepositoryIcons extends Model {}

RepositoryIcons.init(
    {
        iconId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        repositoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'RepositoryIcons',
        timestamps: false,
    }
)
export default RepositoryIcons;
