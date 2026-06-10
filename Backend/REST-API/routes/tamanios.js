const express = require('express');
const router = express.Router();
const { getTamanios } = require('../controllers/catalogos');

router.get('/', getTamanios);

module.exports = router;
