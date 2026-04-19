require('dotenv').config();

const { Sequelize } = require('sequelize');

const database = process.env.DATABASE;
const user = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;


const sequelize = new Sequelize(
    database,
    user,
    password,
    {
        host: host,
        dialect: 'mysql'
    }
);

const db = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexion establecida con la base de datos');
    } catch (error) {
        console.log('Error de conexion: ', error);
    }
};

module.exports = { db, sequelize };