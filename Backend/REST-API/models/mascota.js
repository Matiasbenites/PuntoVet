// models/Mascota.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mascota = sequelize.define('mascota', {
    codMascota: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreMascota: {
        type: DataTypes.STRING(100)
    }
},
    {
        tableName: 'mascota',
        timestamps: false
    },
);

module.exports = Mascota;
