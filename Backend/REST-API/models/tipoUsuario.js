// models/TipoUsuario.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TipoUsuario = sequelize.define('tipo_usuario', {
    codTipoUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoUsuario: {
        type: DataTypes.STRING(40),
        allowNull: false
    }
},
    {
        tableName: 'tipo_usuario',
        timestamps: false
    },
);

module.exports = TipoUsuario;
