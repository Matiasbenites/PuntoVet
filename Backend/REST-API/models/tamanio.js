// models/Tamanio.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tamanio = sequelize.define('tamanio', {
    codTamanio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreTamanio: {
        type: DataTypes.STRING(100)
    }
},
    {
        tableName: 'tamanio',
        timestamps: false
    },
);

module.exports = Tamanio;
