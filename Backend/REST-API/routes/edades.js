const express = require('express');
const router = express.Router();
const { getEdades } = require('../controllers/catalogos');

router.get('/', getEdades);

module.exports = router;
