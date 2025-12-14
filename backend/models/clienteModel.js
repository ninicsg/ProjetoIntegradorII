const { DataTypes } = require("sequelize");
const sequelize = require("../db/index.js"); // importa a conexão com o banco

const Cliente = sequelize.define("cliente", {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pontos_fidelidade: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,//nao aceita valores negativos
        },
    },
}, {
    tableName: "cliente", // nome da tabela no banco
    timestamps: false,
});


module.exports = Cliente;
