

const manejadorErrores = (res, message = 'Ocurrio un error', code = 403) => {
    res.status(code);
    res.send({ error: message })
};

module.exports = manejadorErrores;