const { tipoPago } = require("../models")

const getTiposPagos = async (req, res) => {
    try {
        const tipoPagos = await tipoPago.findAll();
        res.status(200).json(tipoPagos);
    } catch (error) {
        res.status(401).json({ message: 'Error al obtener los metodos de pagos.', error })
    }
}

const setTipoPago = async (req, res) => {
    const { body } = req;
    try {
        const nuevoTipoPago = await tipoPago.create(body);
        res.status(200).json({ nuevoTipoPago, message: 'Nuevo tipo de pago creado correctamente' })
    } catch (error) {
        res.status(401).json({ message: 'Error al agregar el nuevo tipo de pago', error })
    }
}

const getTipoPago = async (req, res) => {
    const { id } = req.params;
    try {
        const unTipoPago = await tipoPago.findByPk(id);
        console.log('Llega', unTipoPago);
        res.status(200).json(unTipoPago)
    } catch (error) {
        res.status(401).json({ message: 'Error al obtener el tipo de pago.', error })
    }
}

const deleteTipoPago = async (req, res) => {
    const { id } = req.params;
    try {
        await tipoPago.update({ estado: false }, { where: { codTipoPago: id } });
        res.status(200).json({ message: 'Tipo de pago actualizado' });
    } catch (error) {
        res.status(200).json({ message: 'Erro en la actualizacion del tipo de pago.', error })
    }
}

module.exports = { getTiposPagos, setTipoPago, getTipoPago, deleteTipoPago }