const { Pagamento, Usuario, Cliente } = require('../models');
const sequelize = require('../db');

const PagamentoController = {
    
    async listar(req, res) {
        try {
            const pagamentos = await Pagamento.findAll({
                include: [
                    { 
                        model: Usuario, 
                        as: 'clientePagamento', 
                        attributes: ['nome', 'id_usuario'] 
                    }
                ],
                order: [['data', 'DESC']]
            });

            res.json(pagamentos);

        } catch (error) {
            console.error('Erro ao listar pagamentos:', error);
            res.status(500).json({ error: 'Erro interno' });
        }
    },

    async criar(req, res) {

        const t = await sequelize.transaction();

        try {
            const { tipo_pagamento, valor, id_agendamento, id_cliente, id_funcionario } = req.body;

            if (!valor || !id_cliente)
                return res.status(400).json({ error: 'valor e id_cliente obrigatórios' });

            // cria pagamento
            const pagamento = await Pagamento.create(
                { tipo_pagamento, valor, id_agendamento, id_cliente, id_funcionario },
                { transaction: t }
            );

            // regra de fidelidade: 1 ponto por R$10
            const pontos = Math.floor(parseFloat(valor) / 10);

            if (pontos > 0) {
                await Cliente.increment(
                    { pontos_fidelidade: pontos },
                    { where: { id_usuario: id_cliente }, transaction: t }
                );
            }

            await t.commit();

            // retorna pagamento recém criado com o include correto
            const criado = await Pagamento.findByPk(pagamento.id_pagamento, {
                include: [
                    { 
                        model: Usuario, 
                        as: 'clientePagamento', 
                        attributes: ['nome'] 
                    }
                ]
            });

            res.status(201).json(criado);

        } catch (error) {
            await t.rollback();
            console.error('Erro ao criar pagamento:', error);
            res.status(500).json({ error: 'Erro ao criar pagamento' });
        }
    }
};

module.exports = PagamentoController;
