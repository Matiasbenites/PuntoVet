
// models/ProductoEdad.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Edad = require('./edad');

const ProductoEdad = sequelize.define('producto_edad', {
    codProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'producto',
            key: 'codProducto'
        }
    },
    codEdad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'edad',
            key: 'codEdad'
        }
    }
},
    {
        tableName: 'producto_edad',
        timestamps: false,
    },
);

module.exports = ProductoEdad;
