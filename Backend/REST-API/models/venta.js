// models/Venta.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const TipoPago = require('./tipoPago');
const Usuario = require('./usuario');
const { venta, ventaDetalle, usuario } = require('.');
const VentaDetalle = require('./ventaDetalle');
const Producto = require('./producto');

const Venta = sequelize.define('venta', {
    codVenta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codTipoPago: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    codUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'codUsuario'
        }
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
        timestamps: false,
        tableName: 'venta'
    }
);

Venta.hasMany(VentaDetalle, { foreignKey: "codVenta" });
Venta.belongsTo(Usuario, { foreignKey: 'codUsuario' });
Venta.belongsTo(TipoPago, { foreignKey: 'codTipoPago' })

Venta.VentaDetallada = async (codVenta) => {
    const unaVenta = await Venta.findOne({
        where: { codVenta },
        include: [
            {
                model: VentaDetalle,
                attributes: [
                    'codProducto',
                    'cantidad',
                    'precioUnitario',
                    'subTotal',
                    'tipoVenta'
                ],
                include: {
                    model: Producto,
                    attributes: ['nombre']
                }
            },
            {
                model: Usuario,
                attributes: [
                    'nombreApellido'
                ]
            },
            {
                model: TipoPago,
                attributes: [
                    'nombreTipoPago',
                    'recargo'
                ]
            }
        ]
    })
    if (!unaVenta) {
        throw new Error('Venta no encontrada')
    }
    return unaVenta
}


module.exports = Venta;
