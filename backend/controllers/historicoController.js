const HistoricoModel = require("../models/historicoModel.js");

const HistoricoController = {
  async listar(req, res) {
    try {
      const historico = await HistoricoModel.getAll();
      res.json(historico);
    } catch (error) {
      console.error("Erro ao listar histórico:", error);
      res.status(500).json({ erro: "Erro ao listar histórico" });
    }
  },

  async criar(req, res) {
    try {
      const registro = await HistoricoModel.create(req.body);
      res.status(201).json(registro);
    } catch (error) {
      console.error("Erro ao criar registro no histórico:", error);
      res.status(500).json({ erro: "Erro ao criar registro no histórico" });
    }
  },
};

module.exports = HistoricoController;
