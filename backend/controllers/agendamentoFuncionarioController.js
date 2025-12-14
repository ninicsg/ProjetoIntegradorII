const AgendamentoModel = require("../models/agendamentoModel.js");
// 🚨 ESTAS IMPORTAÇÕES SÃO CRUCIAIS PARA O INCLUDE:
const sequelize = require("../db/index.js"); 

const AgendamentoFuncionarioController = {
  async listar(req, res) {
    try {
      const { id_funcionario } = req.query;
      let agendamentos;

      if (id_funcionario) {
        // OPÇÃO 1: Raw SQL com Sequelize (usando $1 para parâmetros)
        agendamentos = await sequelize.query(`
          SELECT id_agendamento, 
                 u.nome as nome_cliente, 
                 a.data, 
                 a.hora, 
                 s.nome as tratamento, 
                 a.status,
                 a.gratuito
          FROM agendamento a 
          JOIN cliente c ON a.id_cliente = c.id_usuario 
          JOIN usuario u ON c.id_usuario = u.id_usuario 
          JOIN tratamento s ON a.id_tratamento = s.id_tratamento 
          WHERE a.id_funcionario = $1
            and a.data >= CURRENT_DATE 
          ORDER BY a.data ASC, a.hora ASC
        `, {
          bind: [id_funcionario], 
          type: sequelize.QueryTypes.SELECT
        });

        console.log('Agendamentos encontrados:', agendamentos);
        return res.json(agendamentos);

      } else {
        // Se não houver ID do funcionário, retorna todos os agendamentos (pode ser ajustado)
        agendamentos = []; 
        res.json(agendamentos);
      }

    } catch (error) {
      console.error("Erro ao listar agendamentos do funcionário:", error);
      res.status(500).json({ error: "Erro interno do servidor ao listar agendamentos" });
    }
  },
};

module.exports = AgendamentoFuncionarioController;