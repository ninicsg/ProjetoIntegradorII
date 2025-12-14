const { Agendamento, Usuario, Tratamento, Cliente } = require('../models');
const { Op } = require('sequelize');

const AgendamentoController = {

    // LISTAR TODOS
    async listar(req, res) {
        try {
            const agendamentos = await Agendamento.findAll({
                include: [
                    { model: Usuario, as: 'clienteAgendamento', attributes: ['id_usuario', 'nome'] },
                    { model: Usuario, as: 'funcionarioAgendamento', attributes: ['id_usuario', 'nome'] },
                    { model: Tratamento, as: 'tratamentoAgendamento', attributes: ['id_tratamento', 'nome', 'preco'] }
                ],
                order: [['data', 'DESC'], ['hora', 'DESC']]
            });

            res.json(agendamentos);
        } catch (err) {
            console.error("Erro ao listar:", err);
            res.status(500).json({ error: "Erro ao listar agendamentos" });
        }
    },


    // LISTAR POR CLIENTE
    async listarPorCliente(req, res) {
        try {
            const { id } = req.params;

            const agendamentos = await Agendamento.findAll({
                where: { id_cliente: id },
                attributes: [
                    'id_agendamento',
                    'data',
                    'hora',
                    'status',
                    'id_tratamento',
                    'id_cliente',
                    'id_funcionario'
                ],
                include: [
                    {
                        model: Tratamento,
                        as: 'tratamentoAgendamento',
                        attributes: ['nome', 'preco']
                    }
                ],
                order: [['data', 'DESC'], ['hora', 'DESC']]
            });

            res.json(agendamentos);

        } catch (err) {
            console.error("Erro ao listar por cliente:", err);
            res.status(500).json({ error: 'Erro interno' });
        }
    },


    // CRIAR AGENDAMENTO
    async criar(req, res) {
        try {
            console.log("chegou")
            const { id_tratamento, data, hora, id_funcionario, id_cliente } = req.body;

            if (!id_cliente) {
                return res.status(400).json({
                    error: "id_cliente não enviado e nenhum usuário autenticado"
                });
            }

            if (!id_tratamento || !data || !hora || !id_funcionario) {
                return res.status(400).json({ error: 'Campos obrigatórios faltando' });
            }

            // Verifica conflito de horário para o funcionário
            const conflito = await Agendamento.findOne({
                where: { id_funcionario, data, hora }
            });

            if (conflito) {
                return res.status(400).json({
                    error: 'Este horário já está ocupado para este funcionário'
                });
            }

            const cliente = await Cliente.findByPk(id_cliente);
            const tratamento = await Tratamento.findByPk(id_tratamento);

            if (!cliente || !tratamento) {
                return res.status(400).json({ error: 'Cliente ou tratamento inválido' });
            }

            let gratuito = false;
            if(cliente.pontos_fidelidade >= Math.floor(tratamento.preco) * 10){ 
                await cliente.decrement(
                    { pontos_fidelidade: Math.floor(tratamento.preco) * 10 },
                    { where: { id_usuario: id_cliente } }
                );
                gratuito = true;
            }
            // Criar agendamento
            const novo = await Agendamento.create({
                id_tratamento,
                data,
                hora,
                id_cliente,
                id_funcionario,
                gratuito,
                status: "pendente"
            });

            // Buscar com include completo
            const criado = await Agendamento.findByPk(novo.id_agendamento, {
                include: [
                    { model: Usuario, as: 'clienteAgendamento', attributes: ['nome'] },
                    { model: Tratamento, as: 'tratamentoAgendamento', attributes: ['nome', 'preco'] }
                ]
            });

            res.status(201).json(criado);

        } catch (err) {
            console.error("Erro ao criar agendamento:", err);
            res.status(500).json({ error: 'Erro ao criar agendamento' });
        }
    },


    // ATUALIZAR
    async atualizar(req, res) {
        try {
            const { id } = req.params;

            // impede troca de cliente/funcionário via PUT
            delete req.body.id_cliente;
            delete req.body.id_funcionario;

            const [ok] = await Agendamento.update(req.body, {
                where: { id_agendamento: id }
            });

            if (!ok)
                return res.status(404).json({ error: 'Agendamento não encontrado' });

            const atualizado = await Agendamento.findByPk(id, {
                include: [
                    { model: Usuario, as: 'clienteAgendamento' },
                    { model: Usuario, as: 'funcionarioAgendamento' },
                    { model: Tratamento, as: 'tratamentoAgendamento' }
                ]
            });

            res.json(atualizado);

        } catch (err) {
            console.error("Erro ao atualizar:", err);
            res.status(500).json({ error: 'Erro ao atualizar agendamento' });
        }
    },


    // DELETAR
    async deletar(req, res) {
        try {
            const { id } = req.params;

            const deleted = await Agendamento.destroy({
                where: { id_agendamento: id }
            });

            if (!deleted)
                return res.status(404).json({ error: 'Agendamento não encontrado' });

            res.status(204).send();

        } catch (err) {
            console.error("Erro ao deletar:", err);
            res.status(500).json({ error: 'Erro ao deletar agendamento' });
        }
    },


    // CANCELAR
    async cancelar(req, res) {
        try {
            const { id } = req.params;

            const agendamento = await Agendamento.findByPk(id);

            if (!agendamento)
                return res.status(404).json({ error: "Agendamento não encontrado" });

            if (agendamento.status === "cancelado")
                return res.status(400).json({ error: "Agendamento já está cancelado" });

            await agendamento.update({ status: "cancelado" });

            return res.json({ message: "Agendamento cancelado com sucesso" });

        } catch (err) {
            console.error("Erro ao cancelar agendamento:", err);
            res.status(500).json({ error: "Erro ao cancelar agendamento" });
        }
    },
};

module.exports = AgendamentoController;
