// models/CompraDetalle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Producto = require('./producto');

const CompraDetalle = sequelize.define('compra_detalle', {
    codCompraDetalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codCompra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compra',
            key: 'codCompra'
        }
    },
    codProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioCompra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    precioVenta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    precioSuelto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
},
    {
        tableName: 'compra_detalle',
        timestamps: false
    }
);

CompraDetalle.belongsTo(Producto, { foreignKey: 'codProducto' });

module.exports = CompraDetalle;
