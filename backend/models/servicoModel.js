const { DataTypes } = require("sequelize");
const sequelize = require("../db/index.js"); 

const ServicoModel = sequelize.define("servicos", {
  id_servico: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "id_tratamento" // mapeia id_servico para id_tratamento
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
    // sequelize vai assumir que o nome da coluna é nome
  },
  preco: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
    // o squelize vai assumir que o nome da coluna é preco
  }
}, {
  tableName: "tratamento", // nome correto da tabela
  timestamps: false,
  freezeTableName: true 
});

module.exports = ServicoModel;