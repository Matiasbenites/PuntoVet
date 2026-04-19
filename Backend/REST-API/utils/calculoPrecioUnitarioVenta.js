


const calcularPrecioUnitario = async (tipoVenta, precioVenta, precioSuelto) => {

    if (tipoVenta === 3) {
        return precioVenta
    } else {
        return precioSuelto
    }
}

module.exports = calcularPrecioUnitario