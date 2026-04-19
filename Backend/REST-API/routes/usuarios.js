





const express = require('express');
const cors = require('cors');

const { getUsuarios, setUsuario, login, getUsuario, deleteUsuario, updateUsuario } = require('../controllers/usuarios');
const { validatorUsuarios } = require('../validators/usuarios');

const router = express.Router();


router.get('/', getUsuarios);

router.get('/:id', getUsuario);

router.post('/', validatorUsuarios, setUsuario);

router.put('/:id', validatorUsuarios, updateUsuario);

router.delete('/:id', deleteUsuario);

router.post('/login', login);





module.exports = router;