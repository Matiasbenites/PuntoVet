// models/TipoPago.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TipoPago = sequelize.define('tipo_pago', {
    codTipoPago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreTipoPago: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    recargo: {
        type: DataTypes.DOUBLE(5, 3),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},
    {
        tableName: 'tipo_pago',
        timestamps: false
    }
);

module.exports = TipoPago;
