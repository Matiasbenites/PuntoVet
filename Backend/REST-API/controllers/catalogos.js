const Categoria = require('../models/categoria');
const Tamanio = require('../models/tamanio');
const Mascota = require('../models/mascota');
const Edad = require('../models/edad');
const manejadorErrores = require('../utils/manejadorErrores');

const getCategorias = async (req, res) => {
    try {
        const data = await Categoria.findAll();
        res.json(data);
    } catch (e) {
        manejadorErrores(res, `Error al obtener categorías: ${e}`);
    }
};

const getTamanios = async (req, res) => {
    try {
        const data = await Tamanio.findAll();
        res.json(data);
    } catch (e) {
        manejadorErrores(res, `Error al obtener tamaños: ${e}`);
    }
};

const getMascotas = async (req, res) => {
    try {
        const data = await Mascota.findAll();
        res.json(data);
    } catch (e) {
        manejadorErrores(res, `Error al obtener mascotas: ${e}`);
    }
};

const getEdades = async (req, res) => {
    try {
        const data = await Edad.findAll();
        res.json(data);
    } catch (e) {
        manejadorErrores(res, `Error al obtener edades: ${e}`);
    }
};

module.exports = { getCategorias, getTamanios, getMascotas, getEdades };
