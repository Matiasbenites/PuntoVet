
const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw();


        return next(); // Continua al controlador
    } catch (err) {
        console.log('Error de validacion');
        res.status(403);
        res.send({ errors: err.array() })
    }
}

module.exports = validateResult;