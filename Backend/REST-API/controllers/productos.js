



const { matchedData } = require('express-validator');
const { producto, categoria, tamanio } = require('../models/index');
const manejadorErrores = require('../utils/manejadorErrores');
const Categoria = require('../models/categoria');
const Tamanio = require('../models/tamanio');
const Producto = require('../models/producto');
const ProductoEdad = require('../models/productoEdad');
const ProductoMascota = require('../models/productoMascota');
const { where, Op } = require('sequelize');

const getProductos = async (req, res) => {
    try {
        const { pagina, limite, v_estado, busqueda } = req.query;
        const estado = v_estado === 'true' ? true : false;
        const offset = (parseInt(pagina) - 1) * limite;
        console.log('pagina: ', pagina, 'limite: ', limite, 'offset: ', offset, 'estado: ', estado, 'Busqueda: ', busqueda);
        const productos = await Producto.findAllData({
            offset,
            busqueda,
            limit: parseInt(limite),
            estado
        });
        res.json(productos);
    } catch (e) {
        console.log(e);
        manejadorErrores(res, `Ocurrio un error aca: ${e}`);
    }
};

// const getProductosFilter = async (req, res) => {
//     try {
//         const { v_estado, busqueda } = req.query;
//         const estado = v_estado === 'true' ? true : false;
//         console.log('Estado: ', estado, 'Busqueda: ', busqueda);

//         const codicionesFiltrado = {
//             estado,
//             [Op.or]: [
//                 { nombre: { [Op.like]: `%${busqueda}` } },
//                 { codProducto: { [Op.like]: `%${busqueda}` } }
//             ]
//         };

//         const productos = await Producto.findAllData({ where: codicionesFiltrado });
//         res.json(productos)

//     } catch (error) {
//         manejadorErrores(res, `Ocurrio un error aca: ${error}`);
//     }
// }

const getProducto = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('codProducto: ', id);
        const data = await Producto.findProductData({
            where: { codProducto: id }
        });
        res.send(data);
    } catch (e) {
        manejadorErrores(res, `Ocurrio un error al buscar el producto: ${e}`);
    }
}


const setProductos = async (req, res) => {
    try {
        //Implementar cuando tenga todas las validaciones 
        //const body = matchedData(req);
        const { body, file } = req;
        const { codEdades, codMascotas, peso, stock } = body;

        const pesoTotal = peso * stock;
        body.pesoTotal = pesoTotal;
        console.log(body);
        const productoCreado = await producto.create(body); // Informacion del producto

        await Promise.all(codEdades.map(async (codEdad) => {
            await ProductoEdad.create({ codProducto: productoCreado.codProducto, codEdad }); // Informacion de las edades
        }));

        await Promise.all(codMascotas.map(async (codMascota) => {
            await ProductoMascota.create({ codProducto: productoCreado.codProducto, codMascota }); // Informacion de las mascotas
        }));

        res.send({ message: `Producto agregado correctamente.` });

    } catch (e) {
        manejadorErrores(res, `Datos incorrecto: ${e}`);
        console.log('error al cargar el producto' + e);
    }
};


const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        const { peso, stock } = body;
        const pesoTotal = peso * stock;
        body.pesoTotal = pesoTotal;

        console.log('Codigo del producto: ', id, 'Datos: ', body);
        await ProductoEdad.destroy({ where: { codProducto: id } })
        await ProductoMascota.destroy({ where: { codProducto: id } })

        await producto.update(body, { where: { codProducto: id } });

        await Promise.all(body.codEdades.map(async (codEdad) => {
            await ProductoEdad.create({ codProducto: body.codProducto, codEdad });
        }));

        await Promise.all(body.codMascotas.map(async (codMascota) => {
            await ProductoMascota.create({ codProducto: body.codProducto, codMascota });
        }));
        res.send({ message: `Datos modificado correctamente` });
    } catch (error) {
        manejadorErrores(res, `Datos incorrecto: ${error}`)
    }
}

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Producto a eliminar: ', id);
        const { estado, ...data } = await producto.findByPk(id);
        if (estado === true) {
            await producto.update({ estado: false }, { where: { codProducto: id } });
            res.json({
                message: 'Producto eliminado correctamente',
                data
            });
        } else {
            await producto.update({ estado: true }, { where: { codProducto: id } });
            res.json({
                message: 'Producto restaurado correctamente',
                data
            });
        }
    } catch (error) {
        manejadorErrores(res, 'Ocurrio un error al eliminar el producto')
    }
}





module.exports = { getProductos, setProductos, getProducto, updateProducto, deleteProducto };