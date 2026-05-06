// Utilidad para obtener un producto por su código.
// Busca en la base de datos y retorna los datos del producto completo.
// Se usa internamente en otras operaciones que necesitan la información del producto.

const { producto } = require("../models");





const obtenerProducto = async (parametro) => {
    const productoEncontrado = await producto.findByPk(parametro);
    return productoEncontrado.dataValues;
};

module.exports = obtenerProducto;