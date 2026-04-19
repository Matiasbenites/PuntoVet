
const bcryptjs = require('bcrypt');
const { usuario } = require('../models');
const { where } = require('sequelize');
const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {
    const { estado } = req.query;
    const estadoUsuario = estado === 'true' ? true : false;
    try {
        const usuarios = await Usuario.findAllData({ estadoUsuario });
        res.json(usuarios)
    } catch (error) {
        res.json({
            message: 'Error al listar los usuarios.',
            error
        })
    }
}

const getUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioBusqueda = await usuario.findByPk(id);
        res.json(usuarioBusqueda)
    } catch (error) {
        res.json({
            message: 'Error al obtener el usuario.',
            error
        })
    }
}

const setUsuario = async (req, res) => {
    const { body } = req;
    const { password } = body

    try {
        const passwordHash = await bcryptjs.hash(password, 8);

        body.password = passwordHash;

        const usuarioCreado = await usuario.create(body);
        res.status(201)
        res.json({
            message: 'Usuario creado correctamente',
            usuarioCreado
        })
    } catch (error) {
        res.status(400)
        res.json({
            message: 'Error al crear el usuario',
            error
        })
    }
}

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, ...data } = await usuario.findByPk(id);
        if (estado === true) {
            const usuarioEliminado = await usuario.update({ estado: false }, { where: { codUsuario: id } });
            res.json({
                message: 'Usuario eliminado correctamente',
                usuarioEliminado
            })
        } else {
            const usuarioEliminado = await usuario.update({ estado: true }, { where: { codUsuario: id } });
            res.json({
                message: 'Usuario restaurado correctamente',
                usuarioEliminado
            })
        }
    } catch (error) {
        res.json({
            message: 'Error al eliminar el usuario',
            error
        })
    }

}

const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const { password } = body;
        const passwordHash = await bcryptjs.hash(password, 8);
        body.password = passwordHash;

        const usuarioActualizado = await usuario.update(body, { where: { codUsuario: id } });
        res.json({
            message: 'Usuario actualizado correctamente',
            usuarioActualizado
        })
    } catch (error) {
        res.json({
            message: 'Error al actualizar el usuario',
            error
        })
    }

}

const login = async (req, res) => {
    const { usuario, password } = req.body;
    console.log('Usuario: ', usuario, 'Password: ', password);
    try {
        const usuarioBusqueda = await Usuario.findUser({ usuario })
        console.log('Usuario encontrado', usuarioBusqueda);
        if (usuarioBusqueda) {
            const passwordMatch = await bcryptjs.compare(password, usuarioBusqueda.password);
            if (passwordMatch) {
                res.status(200)
                    .json({
                        message: 'Usuario encontrado',
                        datos: usuarioBusqueda
                    })
            } else {
                res.status(401)
                    .json({
                        message: 'Datos incorrecto'
                    })
            }
        } else {
            res.status(401)
                .json({ message: 'Datos incorrecto' })
        }
    } catch (error) {
        res.status(500)
            .json({
                message: 'Ocurrio un error al intentar ingresar al sistema',
                error
            })
    }
}





module.exports = { getUsuarios, setUsuario, getUsuario, deleteUsuario, updateUsuario, login } 