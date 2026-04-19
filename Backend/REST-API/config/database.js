require('dotenv').config();

const { Sequelize } = require('sequelize');

const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

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