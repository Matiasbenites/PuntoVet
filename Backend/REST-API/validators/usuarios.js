const { check } = require("express-validator");
const validateResult = require("../utils/validator");


const validatorUsuarios = [
    check('nombreApellido').isLength({ min: 3, max: 100 }).notEmpty().exists(),
    check('user').isLength({ min: 3, max: 100 }).notEmpty().exists(),
    check('password').isLength({ min: 4, max: 60 }).notEmpty().exists(),
    check('codTipoUsuario').isInt().notEmpty().exists(),
    check('celular').isLength({ min: 6, max: 20 }).notEmpty().exists(),

    (req, res, next) => validateResult(req, res, next)
]

module.exports = { validatorUsuarios };