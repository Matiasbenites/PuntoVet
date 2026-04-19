// models/Compra.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Usuario = require('./usuario');
const CompraDetalle = require('./compraDetalle');
const Venta = require('./venta');
const models = require('.');
const Producto = require('./producto');

const Compra = sequelize.define('compra', {
    codCompra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    montoTotal: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
},
    {
        tableName: 'compra',
        timestamps: false
    }
);

Compra.hasMany(CompraDetalle, { foreignKey: 'codCompra' });
Compra.belongsTo(Usuario, { foreignKey: 'codUsuario' });

Compra.CompraDetallada = async (codCompra) => {
    const unaCompra = await Compra.findOne({
        where: { codCompra },
        include: [
            {
                model: CompraDetalle,
                attributes: [
                    'cantidad',
                    'codProducto',
                    'subTotal',
                    'precioCompra'
                ],
                include: {
                    model: Producto,
                    attributes: [
                        'nombre'
                    ]
                }
            },
            {
                model: Usuario,
                attributes: [
                    'nombreApellido'
                ]
            }
        ]
    })
    if (!unaCompra) {
        throw new Error('Compra no encontrada');
    }
    return unaCompra;
}

module.exports = Compra;

