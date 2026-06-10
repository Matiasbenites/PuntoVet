const express = require('express');
const router = express.Router();
const { getCategorias } = require('../controllers/catalogos');

router.get('/', getCategorias);

module.exports = router;
