const { DataTypes } = require('sequelize');
const sequelize2 = require('../db');

const Avaliacao = sequelize2.define('avaliacao', {
  id_avaliacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nota: { type: DataTypes.INTEGER, allowNull: false },
  comentario: { type: DataTypes.TEXT, allowNull: true },
  data: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  id_cliente: { type: DataTypes.INTEGER, allowNull: false },
  id_funcionario: { type: DataTypes.INTEGER, allowNull: false },
  
  id_agendamento: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'avaliacao', timestamps: false });

module.exports = Avaliacao;
