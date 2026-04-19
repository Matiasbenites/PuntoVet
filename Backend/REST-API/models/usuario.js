

// models/Usuario.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const TipoUsuario = require('./tipoUsuario');

const Usuario = sequelize.define('usuario', {
    codUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreApellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    celular: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    codTipoUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user: {
        type: DataTypes.STRING(100),
        unique: true
    }
},
    {
        tableName: 'usuario',
        timestamps: false
    },
);

Usuario.belongsTo(TipoUsuario, { foreignKey: 'codTipoUsuario', as: 'tipoUsuario' });
Usuario.findAllData = function ({ estadoUsuario }) {
    return Usuario.findAll({
        where: {
            estado: estadoUsuario
        },
        include: [
            {
                model: TipoUsuario,
                as: 'tipoUsuario'
            }

        ]
    })
}

Usuario.findUser = function ({ usuario }) {
    return Usuario.findOne({
        where: {
            user: usuario
        },
        include: [
            {
                model: TipoUsuario,
                as: 'tipoUsuario'
            }

        ]
    })
}

module.exports = Usuario;
