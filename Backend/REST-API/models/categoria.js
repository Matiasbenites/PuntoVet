


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Importa la instancia de Sequelize

const Categoria = sequelize.define('categoria', {
    codCategoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreCategoria: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
},
    {
        tableName: 'categoria',
        timestamps: false
    },
);



module.exports = Categoria;
