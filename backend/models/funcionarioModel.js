const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const UsuarioModel = require("./usuarioModel.js");

const Funcionario = sequelize.define('funcionario', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, references: { model: UsuarioModel, key: 'id_usuario' } },
    cpf: { type: DataTypes.STRING(14), unique: true, allowNull: false },
    area_atuacao: { type: DataTypes.STRING(100) },
    status: { type: DataTypes.STRING(20), defaultValue: 'ativo' }
}, { tableName: 'funcionario', timestamps: false });


Funcionario.belongsTo(UsuarioModel, { foreignKey: 'id_usuario' });
UsuarioModel.hasOne(Funcionario, { foreignKey: 'id_usuario' });


module.exports = Funcionario;