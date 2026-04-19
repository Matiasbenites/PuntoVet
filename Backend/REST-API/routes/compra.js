


const express = require('express');
const { setCompra, getCompra, getCompras } = require('../controllers/compra');
const router = express.Router();

router.get('/', getCompras)

router.get('/:codCompra', getCompra)

router.post('/', setCompra)


module.exports = router;