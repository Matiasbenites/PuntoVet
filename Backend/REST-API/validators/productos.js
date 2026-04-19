

const { check } = require('express-validator');
const validateResult = require('../utils/validator');

const validatorSetProductos = [
    check('nombre').isLength({ min: 3, max: 100 }).notEmpty().exists(),
    check('descripcion').isLength({ min: 3, max: 300 }).notEmpty().exists(),
    check('codCategoria').isInt().notEmpty().exists(),

    (req, res, next) => {
        if (req.body.mililitro === '') {
            req.body.mililitro = null;
        }
        if (req.body.cantidad === '') {
            req.body.cantidad = null;
        }
        if (req.body.peso === '') {
            req.body.peso = null;
        }
        if (req.body.stock === '') {
            req.body.stock = null;
        }
        if (req.body.precioContado === '') {
            req.body.precioContado = null;
        }
        if (req.body.precioLista === '') {
            req.body.precioLista = null;
        }
        if (req.body.precioSuelto === '') {
            req.body.precioSuelto = null;
        }
        if (req.body.codTamanio === '') {
            req.body.codTamanio = null;
        }
        next();
    },


    (req, res, next) => validateResult(req, res, next)
];

module.exports = { validatorSetProductos };