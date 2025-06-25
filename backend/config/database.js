const {Sequelize} = require('sequelize');

//create sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'task manager',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host:process.env.DB_HOST || 'localhost',
        dialect:'mysql',
        port:process.env.DB_PORT ||3306,
        logging: process.env.NODE_ENV === 'development'? console.log : false,
        pool:{
            max:5,
            min:0,
            acquire:30000,
            idle:10000
        }
    }
);
module.exports = {sequelize};