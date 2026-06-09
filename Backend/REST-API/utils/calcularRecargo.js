const { tipoPago } = require("../models");

// CU: Realizar Venta | Fig 12 paso 11 | Contrato Tabla 27 (Pre: tipo de pago válido)
// Obtiene el multiplicador de recargo según el tipo de pago seleccionado.
// Retorna 1 + recargo/100, p.ej. contado→1, tarjeta 10%→1.1 (RF#19)
const obtenerRecargo = async (opcionPago) => {
    const response = await tipoPago.findByPk(opcionPago);
    if (!response) {
        throw new Error('Tipo de pago no encontrado');
    }

    const recargo = Number(response.recargo) || 0;
    const recargoCalculado = 1 + (recargo / 100)
    return recargoCalculado;
}

module.exports = obtenerRecargo;
