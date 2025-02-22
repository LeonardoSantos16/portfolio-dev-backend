import { Sequelize } from "sequelize";
import { express } from 'express';


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/repository.sql'
})

const app = express()


sequelize.