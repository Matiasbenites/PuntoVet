




const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../utils/cargaStorage');
const { getProductos, setProductos, getProducto, updateProducto, deleteProducto, getProductosFilter } = require('../controllers/productos');
const { validatorSetProductos } = require('../validators/productos');
const customHeader = require('../middleware/customHeader');

// router.get('/filtro', getProductosFilter)

router.get('/', getProductos);

router.get('/:id', getProducto);

router.post('/', validatorSetProductos, setProductos);

router.put('/:id', validatorSetProductos, updateProducto)

router.delete('/:id', deleteProducto)


module.exports = router;