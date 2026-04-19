// models/CompraDetalle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Producto = require('./producto');
const Compra = require('./compra');

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
            model: Compra,
            key: 'codCompra'
        }
    },
    codProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioCompra: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    precioVenta: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    precioSuelto: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subTotal: {
        type: DataTypes.STRING(100),
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
