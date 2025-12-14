const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Tratamento = sequelize.define('tratamento', {
    id_tratamento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    preco: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, { tableName: 'tratamento', timestamps: false });


module.exports = Tratamento;