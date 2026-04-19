// models/ProductoMascota.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Producto = require('./producto');
const Mascota = require('./mascota');

const ProductoMascota = sequelize.define('producto_mascota', {
    codProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Producto,
            key: 'codProducto'
        }
    },
    codMascota: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Mascota,
            key: 'codMascota'
        }
    }
},
    {
        tableName: 'producto_mascota',
        timestamps: false
    },
);

module.exports = ProductoMascota;
