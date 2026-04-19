const { where } = require("sequelize");
const { sequelize } = require("../config/database");
const { producto, compra, compraDetalle } = require("../models");
const obtenerProducto = require("../utils/obtenerProducto");
const Compra = require("../models/compra");

const actualizarProducto = async (cantidad, codProducto, stock, pesoTotal, peso, precioCompra, precioVenta, precioSuelto) => {
    let newStock = 0;
    let newPesoTotal = 0

    newStock = (parseInt(stock) + parseInt(cantidad));
    newPesoTotal = pesoTotal + (parseInt(cantidad) * peso)

    newData = {
        stock: newStock,
        pesoTotal: newPesoTotal,
        precioCompra,
        precioSuelto,
        precioVenta
    }
    await producto.update(newData, { where: { codProducto } })
}


const setCompra = async (req, res) => {
    const { codUsuario, detalleCompra } = req.body;
    const fechaActual = new Date().toISOString().split('T')[0];
    let montoTotal = 0, transaction;
    const datosDetalle = [];
    try {
        transaction = await sequelize.transaction();
        for (item of detalleCompra) {
            const { codProducto: idProducto, cantidad, precioCompra, precioVenta, precioSuelto } = item;
            const producto = await obtenerProducto(idProducto);
            const { codProducto, stock, pesoTotal, peso } = producto;
            const subTotal = (precioCompra * cantidad)

            datosDetalle.push({
                subTotal: subTotal,
                codProducto,
                cantidad,
                precioCompra,
                precioSuelto,
                precioVenta,
            });

            console.log('datosDetalle: ', datosDetalle);
            await actualizarProducto(cantidad, codProducto, stock, pesoTotal, peso, precioCompra, precioVenta, precioSuelto, { transaction });
            montoTotal += subTotal;
        };

        const compraCabecera = {
            codUsuario,
            montoTotal,
            fecha: fechaActual
        }
        console.log('Cabecera compra: ', compraCabecera, 'Detalle Compra: ', detalleCompra);
        const compraCreada = await compra.create(compraCabecera, { transaction });
        const codCompraCreada = compraCreada.codCompra;

        for (item of datosDetalle) {
            await compraDetalle.create({
                codCompra: codCompraCreada,
                codProducto: item.codProducto,
                cantidad: item.cantidad,
                precioCompra: item.precioCompra,
                precioVenta: item.precioVenta,
                precioSuelto: item.precioSuelto,
                subTotal: item.subTotal
            }, { transaction });
        }

        await transaction.commit();

        setTimeout(() => {
            res.status(200).json({ message: 'Compra registrada correctamente.', codCompraCreada })
        }, 10000);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(401).json({ message: 'Error al cargar la compra', error })
    }

}

const getCompra = async (req, res) => {
    const { codCompra } = req.params;
    try {
        const unaCompra = await Compra.CompraDetallada(codCompra);
        res.status(200).json(unaCompra);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

const getCompras = async (req, res) => {
    const { fecha1 = null, fecha2 = null } = req.query;
    try {
        let filtroFechas = {};

        if (fecha1 && fecha2) {
            const [day1, month1, year1] = fecha1.split('/');
            const [day2, month2, year2] = fecha2.split('/');

            const date1 = new Date(`${year1}-${month1}-${day1}`);
            const date2 = new Date(`${year2}-${month2}-${day2}`);

            if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
                filtroFechas.fecha = {
                    [Op.between]: [date1, date2]
                };
            } else {
                throw new Error('Formato de fecha inválido');
            }
        }
        const compras = await compra.findAll({
            where: filtroFechas,
            order: [['codCompra', 'DESC']]
        });

        return res.status(200).json(compras);
    } catch (error) {
        return res.status(401).json({ message: 'Error al obtener las compras', error })
    }
}

module.exports = { setCompra, getCompra, getCompras }