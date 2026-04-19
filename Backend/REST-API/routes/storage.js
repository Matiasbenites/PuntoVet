

const express = require('express');
const uploadMiddleware = require('../utils/cargaStorage');
const { setStorage } = require('../controllers/storage');


const router = express.Router();


router.post('/', uploadMiddleware.single('imagen'), setStorage);




module.exports = router;