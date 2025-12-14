const { DataTypes } = require('sequelize');
const sequelize3 = require('../db');
const Usuario = require("./usuarioModel");

const Pagamento = sequelize3.define('pagamento', {
    id_pagamento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo_pagamento: { type: DataTypes.STRING(50) },
    valor: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    data: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    id_agendamento: { type: DataTypes.INTEGER },
    id_cliente: { type: DataTypes.INTEGER, allowNull: false },
    id_funcionario: { type: DataTypes.INTEGER }
}, { tableName: 'pagamento', timestamps: false });


// Hook: após criar pagamento, atualiza pontos do cliente (ex: 1 ponto a cada R$10)
Pagamento.afterCreate(async (pag, options) => {
    try {
        const valor = parseFloat(pag.valor) || 0;
        const pontosGanhos = Math.floor(valor / 10); // regra de negócio: 1 ponto por 10
        if (pontosGanhos > 0) {
            await Usuario.increment({ pontos_fidelidade: pontosGanhos }, { where: { id_usuario: pag.id_cliente } });
        }
    } catch (err) {
        console.error('Erro ao atualizar pontos de fidelidade:', err);
        // não lançar para não abortar o create do pagamento
    }
});


module.exports = Pagamento;