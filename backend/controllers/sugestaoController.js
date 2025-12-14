const SugestaoModel = require("../models/sugestaoModel.js");

const SugestaoController = {
  async listar(req, res) {
    try {
      const sugestoes = await SugestaoModel.getAll();
      res.json(sugestoes);
    } catch (error) {
      console.error("Erro ao listar sugestões:", error);
      res.status(500).json({ erro: "Erro ao listar sugestões" });
    }
  },

  async criar(req, res) {
    try {
      const sugestao = await SugestaoModel.create(req.body);
      res.status(201).json(sugestao);
    } catch (error) {
      console.error("Erro ao criar sugestão:", error);
      res.status(500).json({ erro: "Erro ao criar sugestão" });
    }
  },
};

module.exports = SugestaoController;
