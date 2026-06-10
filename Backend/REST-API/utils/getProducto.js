// CU: Realizar Venta / Realizar Compra | Fig 13 paso 9: getProducto(codProducto)
// Recupera los datos actuales del producto (stock, pesoTotal, precios) antes de
// ejecutar la lógica de negocio. Si no existe lanza excepción para cortar el flujo.
const { producto } = require("../models");




const getProducto = async (parametro) => {
    const productoEncontrado = await producto.findByPk(parametro);
    if (!productoEncontrado) {
        throw new Error(`Producto ${parametro} no encontrado`);
    }
    return productoEncontrado.dataValues;
};

module.exports = getProducto;
