import sequelize from "../sequelize/db";


sequelize.sync().then(() => console.log('Banco de dados sincronizados')).catch((error: any)=> console.error('Erro ao sincronizar o banco de dados', error))