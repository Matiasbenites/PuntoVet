



const express = require('express');
const { getTiposPagos, setTipoPago, getTipoPago, deleteTipoPago } = require('../controllers/tipoPago');
const router = express.Router();

router.get('/', getTiposPagos);

router.post('/', setTipoPago);

router.get('/:id', getTipoPago);

router.delete('/:id', deleteTipoPago);

module.exports = router