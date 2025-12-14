const UsuarioModel = require("../models/usuarioModel.js"); 
const bcrypt = require("bcrypt");
// Pode ser necessário importar outros modelos, como Agendamento, para validação de exclusão

const ClientesController = {
    // 1. Método para listar todos os usuários com tipo_usuario = 'cliente'
    async listar(req, res) {
        try {
            // sequelize busca todos onde tipo_usuario é 'cliente'
            const clientes = await UsuarioModel.findAll({
                where: { tipo_usuario: 'cliente' }
            });
            
            res.json(clientes);
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            res.status(500).json({ error: "Erro interno ao buscar clientes" });
        }
    },

    // 2. Método para deletar um cliente (DELETE /clientes/:id)
    async deletar(req, res) {
        try {
            const { id } = req.params;
            
            // 🚨 Importante: id_usuario é a PK da tabela usuário
            const deleted = await UsuarioModel.destroy({
                where: { id_usuario: id } 
            });

            if (deleted) {
                // Se um cliente foi excluído com sucesso (deleted > 0)
                return res.status(204).send(); // 204 No Content para sucesso sem retorno de corpo
            }
            
            // Se deleted for 0, significa que o registro não foi encontrado.
            res.status(404).json({ error: "Cliente não encontrado ou já excluído." });
            
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            
            // Erro de integridade de dados (ex: o cliente ainda tem agendamentos ativos)
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(409).json({ 
                    error: "Não é possível excluir o cliente.", 
                    details: "Este cliente possui registros dependentes (ex: agendamentos, histórico, reservas) e deve ser desativado em vez de excluído."
                });
            }

            res.status(500).json({ error: "Erro interno ao deletar cliente." });
        }
    },
    async criar(req, res) {
        try {
            // Captura os dados necessários do corpo da requisição
            const { nome, email, senha, telefone } = req.body;
            
            // Configura os dados do novo cliente
            const dadosCliente = {
                nome,
                email,
                senha, 
                telefone,
                tipo_usuario: 'cliente' // Força o tipo para garantir que seja um cliente
            };

            const novoCliente = await UsuarioModel.create(dadosCliente);
            // Retorna 201 Created e os dados do cliente criado
            res.status(201).json(novoCliente); 
            
        } catch (error) {
            console.error("Erro ao criar cliente:", error);
            
            // Lida com erros de validação do Sequelize (ex: campos nulos ou email duplicado)
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: "Erro de validação ao criar cliente.", 
                    details: error.errors.map(e => e.message) 
                });
            }

            res.status(500).json({ error: "Erro interno ao criar cliente." });
        }
    },

    // 3. Método para atualizar um cliente (PUT /clientes/:id)
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, telefone } = req.body;

            // Busca o cliente pelo id
            const cliente = await UsuarioModel.findOne({
                where: { id_usuario: id, tipo_usuario: 'cliente' }
            });

            if (!cliente) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            // Prepara os dados para atualização (apenas os campos enviados)
            const dadosAtualizacao = {};
            if (nome !== undefined) dadosAtualizacao.nome = nome;
            if (email !== undefined) dadosAtualizacao.email = email;
            if (senha !== undefined) {
                dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
            };
            if (telefone !== undefined) dadosAtualizacao.telefone = telefone;

            // Atualiza o cliente
            await UsuarioModel.update(dadosAtualizacao, { where: { id_usuario: id } });

            // Retorna o cliente atualizado
            res.json(cliente);

        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);

            // Lida com erros de validação do Sequelize
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: "Erro de validação ao atualizar cliente.", 
                    details: error.errors.map(e => e.message) 
                });
            }

            res.status(500).json({ error: "Erro interno ao atualizar cliente." });
        }
    }
};

module.exports = ClientesController;