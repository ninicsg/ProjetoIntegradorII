const ReservaProdutoModel = require("../models/reservaProdutoModel.js");

const ReservaProdutoController = {
  async listar(req, res) {
    try {
      const reservas = await ReservaProdutoModel.getAll();
      res.json(reservas);
    } catch (error) {
      console.error("Erro ao listar reservas:", error);
      res.status(500).json({ erro: "Erro ao listar reservas" });
    }
  },

  async criar(req, res) {
    try {
      const reserva = await ReservaProdutoModel.create(req.body);
      res.status(201).json(reserva);
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      res.status(500).json({ erro: "Erro ao criar reserva" });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const reserva = await ReservaProdutoModel.updateStatus(req.params.id, req.body.status);
      res.json(reserva);
    } catch (error) {
      console.error("Erro ao atualizar reserva:", error);
      res.status(500).json({ erro: "Erro ao atualizar reserva" });
    }
  },
};

module.exports = ReservaProdutoController;
