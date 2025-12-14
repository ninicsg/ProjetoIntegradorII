const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const Avaliacao = require("../models/avaliacaoModel");

const AvaliacaoController = {
  // todas as avaliações
  async listar(req, res) {
    try {
      const avaliacoes = await Avaliacao.findAll({
        order: [["data", "DESC"]],
      });
      res.json(avaliacoes);
    } catch (error) {
      console.error("Erro ao listar avaliações:", error);
      res.status(500).json({ erro: "Erro ao listar avaliações" });
    }
  },

  //criar uma nova avaliacao com base no agendamento
  async criar(req, res) {
    try {
      console.log("REQ BODY RECEBIDO:", req.body);
      const { nota, comentario, id_agendamento } = req.body;

      if (!id_agendamento) {
        return res.status(400).json({ erro: "id_agendamento não foi enviado" });
      }

      // busca o cliente e funcionario com base no agendamento
      const [resultado] = await sequelize.query(
        "SELECT id_cliente, id_funcionario FROM Agendamento WHERE id_agendamento = ?",
        { replacements: [id_agendamento], type: Sequelize.QueryTypes.SELECT }
      );

      if (!resultado) {
        return res.status(404).json({ erro: "Agendamento não encontrado" });
      }
      console.log("Resultado da consulta do agendamento:", resultado);
      const { id_cliente, id_funcionario } = resultado;

      const novaAvaliacao = await Avaliacao.create({
        nota,
        comentario,
        data: new Date(),
        id_cliente,
        id_funcionario,
        id_agendamento,
      });

      res.status(201).json(novaAvaliacao);
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      res.status(500).json({ erro: "Erro ao criar avaliação" });
    }
  },
};

module.exports = AvaliacaoController;
