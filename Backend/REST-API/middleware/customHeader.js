

const customHeader = (req, res, next) => {
    try {
        const apikey = req.headers.apikey;
        if (apikey === '123456') {
            return next();
        } else {
            res.status(403)
            res.send({ error: "API_KEY incorrecta" })
        }
    } catch (err) {
        res.status(403)
        res.send({ error: "Algo ocurrio en el header" })
    }
}

module.exports = customHeader;