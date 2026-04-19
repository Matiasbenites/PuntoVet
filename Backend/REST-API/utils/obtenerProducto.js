const { producto } = require("../models");





const obtenerProducto = async (parametro) => {
    const productoEncontrado = await producto.findByPk(parametro);
    return productoEncontrado.dataValues;
};

module.exports = obtenerProducto;