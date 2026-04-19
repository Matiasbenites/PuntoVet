const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const { venta, ventaDetalle } = require("../models");
const Venta = require("../models/venta");
const actualizarStock = require("../utils/actualizarStockVenta");
const calcularPrecioUnitario = require("../utils/calculoPrecioUnitarioVenta");
const obtenerProducto = require("../utils/obtenerProducto");
const obtenerRecargo = require("../utils/calcularRecargo");




const setVenta = async (req, res) => {
    let transaction;
    const datosDetalle = [];
    const { body } = req;
    const { opcionPago, codUsuario, detalleVenta } = body;
    const fechaActual = new Date().toISOString().split('T')[0];

    try {
        let montoTotal = 0;

        transaction = await sequelize.transaction();

        const recargo = await obtenerRecargo(opcionPago);
        for (item of detalleVenta) {
            const { codProducto: idProducto, cantidad, tipoVenta } = item;
            const producto = await obtenerProducto(idProducto);
            const { codProducto, stock, pesoTotal, peso, precioSuelto, precioVenta } = producto;
            const precioUnitario = await calcularPrecioUnitario(tipoVenta, precioVenta, precioSuelto);
            const subTotal = ((precioUnitario * cantidad) * recargo);

            datosDetalle.push({
                codProducto: codProducto,
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                subTotal: subTotal,
                tipoVenta: tipoVenta,
            })

            await actualizarStock(codProducto, tipoVenta, cantidad, pesoTotal, peso, stock, { transaction });
            montoTotal += subTotal;
            console.log('MontoTotal: ', montoTotal);
        };

        const ventaCabecera = {
            codTipoPago: opcionPago,
            codUsuario,
            montoTotal,
            fecha: fechaActual
        }

        const ventaCreada = await venta.create(ventaCabecera, { transaction });
        const codVentaGenerada = ventaCreada.codVenta;

        for (item of datosDetalle) {
            await ventaDetalle.create({
                codVenta: codVentaGenerada,
                codProducto: item.codProducto,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                subTotal: item.subTotal,
                tipoVenta: item.tipoVenta
            }, { transaction });
        }

        await transaction.commit();


        setTimeout(() => {
            res.status(200).json({ message: "Venta registrada correctamente", codVentaGenerada });
        }, 10000);
    } catch (error) {
        if (transaction) await transaction.rollback();

        res.status(401).json({ error: "Error al generar la venta", error });
    }

}


const getVenta = async (req, res) => {
    const codVenta = req.params.codVenta;
    try {
        const unaVenta = await Venta.VentaDetallada(codVenta);
        res.status(200).json(unaVenta);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getVentas = async (req, res) => {
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

        const ventas = await venta.findAll({
            where: filtroFechas,
            order: [['codVenta', 'DESC']]
        });
        return res.status(200).json(ventas);
    } catch (error) {
        return res.status(401).json({ message: 'Error al obtener las ventas', error });
    }
}




module.exports = { setVenta, getVenta, getVentas }

