const config = require('./config/config.json')
const {Sequelize} = require('sequelize')

const env = 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

export default sequelize;