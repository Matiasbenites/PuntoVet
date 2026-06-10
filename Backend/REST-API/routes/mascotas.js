const express = require('express');
const router = express.Router();
const { getMascotas } = require('../controllers/catalogos');

router.get('/', getMascotas);

module.exports = router;
