



const express = require('express');
const router = express.Router();
const { setVenta, getVenta, getVentas } = require('../controllers/venta');
const { validatorSetVenta, validatorGetVenta } = require('../validators/ventas');

router.get('/:codVenta', validatorGetVenta, getVenta);

router.get('/', getVentas);

router.post('/', validatorSetVenta, setVenta);


module.exports = router;