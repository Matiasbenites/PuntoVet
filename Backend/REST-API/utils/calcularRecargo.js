const { tipoPago } = require("../models");

const obtenerRecargo = async (opcionPago) => {
    const response = await tipoPago.findByPk(opcionPago);
    const recargoCalculado = 1 + (response.recargo / 100)
    return recargoCalculado;
}

module.exports = obtenerRecargo;