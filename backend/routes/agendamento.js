const express = require("express");
const router = express.Router();
const AgendamentoController = require("../controllers/agendamentoController.js");

// Lista todos os agendamentos
router.get("/", AgendamentoController.listar);

// Lista agendamentos de um cliente
router.get("/clientes/:id", AgendamentoController.listarPorCliente);

// Criar agendamento
router.post("/", AgendamentoController.criar);

// Atualizar agendamento
router.put("/:id", AgendamentoController.atualizar);

// Cancelar agendamento
router.put("/:id/cancelar", AgendamentoController.cancelar);

// Deletar agendamento
router.delete("/:id", AgendamentoController.deletar);

module.exports = router;
