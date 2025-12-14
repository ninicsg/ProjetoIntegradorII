const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Agendamento = sequelize.define(
  "Agendamento",
  {
    id_agendamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    id_tratamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tratamento",
        key: "id_tratamento",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    gratuito: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pendente", // unificado com o controller
    },

    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id_usuario",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    id_funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id_usuario",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "agendamento",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Agendamento;
