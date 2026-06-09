

const { check } = require('express-validator');
const validateResult = require('../utils/validator');

const validatorSetVenta = [
    check('opcionPago').isInt().notEmpty().exists(),
    check('codUsuario').isInt().notEmpty().exists(),
    check('detalleVenta').isArray().custom(value => {
        if (value.length === 0) {
            throw new Error('Debe agregar al menos un producto a la venta')
        }
        return true;
    }),
    check('detalleVenta.*.codProducto').isInt().notEmpty(),
    check('detalleVenta.*.cantidad').isFloat({ gt: 0 }).notEmpty(),
    check('detalleVenta.*.tipoVenta').isInt({ min: 1, max: 3 }).notEmpty(),

    (req, res, next) => validateResult(req, res, next)
]

const validatorGetVenta = [
    check('codVenta').isInt().notEmpty().exists(),

    (req, res, next) => validateResult(req, res, next)
]

module.exports = { validatorSetVenta, validatorGetVenta }
