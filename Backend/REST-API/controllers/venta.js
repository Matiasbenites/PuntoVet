const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const { venta, ventaDetalle } = require("../models");
const Venta = require("../models/venta");
const actualizarStock = require("../utils/actualizarStockVenta");
const calcularPrecioUnitario = require("../utils/calculoPrecioUnitarioVenta");
const obtenerProducto = require("../utils/obtenerProducto");
const obtenerRecargo = require("../utils/calcularRecargo");




// CU: Realizar Venta | Tabla 33 | Fig 12 | Contrato Tabla 27
// Pre: carrito no vacío, tipo de pago seleccionado, stock suficiente por producto.
// Post: venta persistida, stock decrementado, detalle registrado, transacción confirmada.
// Curso alternativo: stock insuficiente → rollback → HTTP 400.
const setVenta = async (req, res) => {
    let transaction;
    const datosDetalle = [];
    const { body } = req;
    const { opcionPago, codUsuario, detalleVenta } = body;
    const fechaActual = new Date().toISOString().split('T')[0];

    try {
        let montoTotal = 0;
        const recargo = await obtenerRecargo(opcionPago);

        transaction = await sequelize.transaction();

        for (const item of detalleVenta) {
            const { codProducto: idProducto, cantidad, tipoVenta } = item;
            const cantidadNormalizada = Number(cantidad);
            const tipoVentaNormalizado = Number(tipoVenta);
            const producto = await obtenerProducto(idProducto);
            const { codProducto, stock, pesoTotal, peso, precioSuelto, precioVenta } = producto;
            const precioUnitario = await calcularPrecioUnitario(tipoVentaNormalizado, precioVenta, precioSuelto);
            const subTotal = Number(precioUnitario) * cantidadNormalizada;

            datosDetalle.push({
                codProducto,
                cantidad: cantidadNormalizada,
                precioUnitario,
                subTotal,
                tipoVenta: tipoVentaNormalizado
            });

            await actualizarStock(codProducto, tipoVentaNormalizado, cantidadNormalizada, pesoTotal, peso, stock, { transaction });
            montoTotal += subTotal;
        }

        montoTotal = montoTotal * recargo;

        const ventaCabecera = {
            codTipoPago: Number(opcionPago),
            codUsuario: Number(codUsuario),
            montoTotal,
            fecha: fechaActual
        };

        const ventaCreada = await venta.create(ventaCabecera, { transaction });
        const codVentaGenerada = ventaCreada.codVenta;

        for (const item of datosDetalle) {
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

        res.status(200).json({ message: "Venta realizada con éxito", codVentaGenerada });
    } catch (error) {
        console.error('Error en setVenta:', error);
        if (transaction) await transaction.rollback();
        res.status(400).json({ message: "Error al generar la venta", error: error.message || error });
    }

}


// CU: Visualizar Venta (detalle) | Tabla 34 CP2-CP4 | Fig 13 | Contrato Tabla 28
// Retorna cabecera + líneas de detalle de una venta. Si no existe → HTTP 400.
const getVenta = async (req, res) => {
    const codVenta = req.params.codVenta;
    try {
        const unaVenta = await Venta.VentaDetallada(codVenta);
        res.status(200).json(unaVenta);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// CU: Visualizar Venta (listado) | Tabla 34 CP1 | Fig 13
// Retorna todas las ventas, con filtro opcional por rango de fechas (dd/mm/yyyy).
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

