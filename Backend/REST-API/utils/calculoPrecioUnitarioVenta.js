


// CU: Realizar Venta | Fig 12 paso 14 | Contrato Tabla 27
// Determina el precio unitario según el tipo de venta:
//   tipoVenta=3 (Bolsa) → precioVenta; tipoVenta=1/2 (Plata/Kilo) → precioSuelto
const calcularPrecioUnitario = async (tipoVenta, precioVenta, precioSuelto) => {
    const tipoVentaNormalizado = Number(tipoVenta);
    const precioUnitario = tipoVentaNormalizado === 3 ? Number(precioVenta) : Number(precioSuelto);

    if (!Number.isFinite(precioUnitario) || precioUnitario <= 0) {
        throw new Error('El producto no tiene un precio valido para el tipo de venta seleccionado');
    }

    return precioUnitario;
}

module.exports = calcularPrecioUnitario
