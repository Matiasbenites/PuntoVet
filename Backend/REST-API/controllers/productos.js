const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const Producto = require('../models/producto');
const manejadorErrores = require('../utils/manejadorErrores');

// CU: Consultar Productos | Tabla 29 | Fig 10
const getProductos = async (req, res) => {
    try {
        const { pagina, limite, v_estado, busqueda } = req.query;
        const offset = (parseInt(pagina) - 1) * parseInt(limite);
        const estado = v_estado === 'true' ? 1 : 0;
        const productos = await sequelize.query(
            'CALL BuscarProductos(:param, :limite, :offset, :v_estado)',
            {
                replacements: { param: busqueda || '', limite: parseInt(limite), offset, v_estado: estado },
                type: QueryTypes.RAW
            }
        );
        res.json(productos);
    } catch (e) {
        manejadorErrores(res, `Ocurrio un error: ${e}`);
    }
};

// CU: Modificar Producto | Tabla 31 | Fig 11
const getProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Producto.findProductData({ where: { codProducto: id } });
        res.send(data);
    } catch (e) {
        manejadorErrores(res, `Ocurrio un error al buscar el producto: ${e}`);
    }
};

// CU: Agregar Producto | Tabla 30 | Fig 10
const setProductos = async (req, res) => {
    try {
        const { body } = req;
        const { peso, stock } = body;
        body.pesoTotal = peso * stock;
        body.codEdades = (body.codEdades ?? []).map(Number);
        body.codMascotas = (body.codMascotas ?? []).map(Number);
        await sequelize.query(
            'CALL InsertarProducto(:json)',
            { replacements: { json: JSON.stringify(body) }, type: QueryTypes.RAW }
        );
        res.send({ message: 'Producto agregado correctamente.' });
    } catch (e) {
        manejadorErrores(res, `Datos incorrecto: ${e}`);
    }
};

// CU: Modificar Producto | Tabla 31 | Fig 11
const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const { peso, stock } = body;
        body.pesoTotal = peso * stock;
        body.codProducto = id;
        body.codEdades = (body.codEdades ?? []).map(Number);
        body.codMascotas = (body.codMascotas ?? []).map(Number);
        await sequelize.query(
            'CALL ModificarProducto(:json)',
            { replacements: { json: JSON.stringify(body) }, type: QueryTypes.RAW }
        );
        res.send({ message: 'Datos modificado correctamente' });
    } catch (e) {
        console.error('Error en updateProducto:', e);
        manejadorErrores(res, `Datos incorrecto: ${e}`);
    }
};

// CU: Eliminar Producto (baja lógica) | Tabla 32 | Fig 11
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const rows = await sequelize.query(
            'SELECT estado FROM producto WHERE codProducto = :id',
            { replacements: { id: parseInt(id) }, type: QueryTypes.SELECT }
        );
        const wasActive = rows[0]?.estado;
        await sequelize.query(
            'CALL ModificarEstadoProducto(:param)',
            { replacements: { param: parseInt(id) }, type: QueryTypes.RAW }
        );
        res.json({
            message: wasActive ? 'Producto eliminado correctamente' : 'Producto restaurado correctamente'
        });
    } catch (e) {
        manejadorErrores(res, 'Ocurrio un error al modificar el estado del producto');
    }
};

module.exports = { getProductos, setProductos, getProducto, updateProducto, deleteProducto };
