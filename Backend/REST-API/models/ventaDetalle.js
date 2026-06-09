// models/VentaDetalle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Producto = require('./producto');

const VentaDetalle = sequelize.define('venta_detalle', {
    codVentaDetalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    codVenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'venta',
            key: 'codVenta'
        }
    },
    codProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: { // Completo
        type: DataTypes.DOUBLE(7, 3),
        allowNull: false
    },
    precioUnitario: { // Completo
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subTotal: {  // Completo
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    tipoVenta: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'venta_detalle',
    timestamps: false
}
 
);
VentaDetalle.belongsTo(Producto, { foreignKey: 'codProducto' });

module.exports = VentaDetalle;
