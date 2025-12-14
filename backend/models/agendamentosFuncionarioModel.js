const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Agendamento = sequelize.define("Agendamento", {
  id_agendamento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  horario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  servico: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Agendamento;
