const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Connecting to database:', process.env.PGDATABASE || 'esmalteriadb');
console.log('Database host:', process.env.PGHOST || 'localhost');
console.log('Database password:', process.env.PGPASSWORD || 'postgres');
console.log('Database user:', process.env.PGUSER || 'postgres');


const sequelize = new Sequelize(
    process.env.PGDATABASE || 'esmalteriadb', 
    process.env.PGUSER || 'postgres',
    process.env.PGPASSWORD || 'postgres',
    {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,        
        dialect: 'postgres',
        logging: false,
        define: { freezeTableName: true }
    }
);


module.exports = sequelize;