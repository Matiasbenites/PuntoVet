



const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Storage = sequelize.define('storage', {
    url: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING(100),
        primaryKey: true
    }
},
    {
        tableName: 'storage',
        timestamps: false
    }

);


module.exports = Storage;