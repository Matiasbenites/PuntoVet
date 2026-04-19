// models/VentaDetalle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Producto = require('./producto');
const Venta = require('./venta');

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
            model: Venta,
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
        type: DataTypes.STRING(100),
        allowNull: false
    },
    subTotal: {  // Completo
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipoVenta: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'venta_detalle',
    timestamps: false
}
 
);
VentaDetalle.belongsTo(Producto, { foreignKey: 'codProducto' })

module.exports = VentaDetalle;
