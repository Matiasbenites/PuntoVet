// models/Edad.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Edad = sequelize.define('edad', {
    codEdad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreEdad: {
        type: DataTypes.STRING(100)
    }
},
    {
        tableName: 'edad',
        timestamps: false
    }
);

module.exports = Edad;
