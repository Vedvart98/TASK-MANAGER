const {Sequelize} = require('sequelize');

//create sequelize instance
const sequelize = new Sequelize(
    process.env.your_db_name || 'task manager',
    process.env.your_db_root || 'root',
    process.env.your_mysql_password || '',
    {
        host:process.env.your_db_host || 'localhost',
        dialect:'mysql',
        port:process.env.your_db_port ||3306,
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