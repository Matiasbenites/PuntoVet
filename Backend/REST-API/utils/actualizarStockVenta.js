const { producto } = require("../models");

 



// CU: Realizar Venta | Fig 12 pasos 17-18 | Contrato Tabla 27 (Post: stock decrementado)
// Recalcula stock y pesoTotal tras una venta y persiste el resultado en la BD.
//   tipoVenta=3 (Bolsa): resta unidades directamente al stock
//   tipoVenta=1/2 (Plata/Kilo): resta kg del pesoTotal y recalcula bolsas con Math.floor
// Lanza error si el resultado es negativo (stock insuficiente).
const actualizarStock = async (codProducto, tipoVenta, cantidad, pesoTotal, peso, stock, options = {}) => {
    let newStock = 0;
    let newPesoTotal = 0;
    const tipoVentaNormalizado = Number(tipoVenta);
    const cantidadNormalizada = Number(cantidad);
    const pesoTotalActual = Number(pesoTotal);
    const pesoUnitario = Number(peso);
    const stockActual = Number(stock);

    if (!Number.isFinite(cantidadNormalizada) || cantidadNormalizada <= 0) {
        throw new Error('La cantidad de venta debe ser mayor a cero');
    }

    if (!Number.isFinite(pesoTotalActual) || !Number.isFinite(stockActual)) {
        throw new Error('El producto no tiene stock valido');
    }

    switch (tipoVentaNormalizado) {
        case 3:
            newStock = stockActual - cantidadNormalizada;
            if (Number.isFinite(pesoUnitario) && pesoUnitario > 0) {
                newPesoTotal = pesoTotalActual - (cantidadNormalizada * pesoUnitario);
            } else {
                newPesoTotal = pesoTotalActual;
            }
            break;
        default:
            if (!Number.isFinite(pesoUnitario) || pesoUnitario <= 0) {
                throw new Error('El producto no tiene peso unitario valido');
            }
            newPesoTotal = pesoTotalActual - cantidadNormalizada;
            newStock = Math.floor(newPesoTotal / pesoUnitario);
            break;
    }

    if (newStock < 0 || newPesoTotal < 0) {
        throw new Error('Stock insuficiente para completar la venta');
    }

    const newData = {
        pesoTotal: newPesoTotal,
        stock: newStock
    }

    await producto.update(newData, { where: { codProducto }, ...options });
}

module.exports = actualizarStock;
