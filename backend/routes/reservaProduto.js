const express = require("express");
const router = express.Router();
const ReservaProdutoController = require("../controllers/reservaProdutoController.js");

router.get("/", ReservaProdutoController.listar);
router.post("/", ReservaProdutoController.criar);
router.put("/:id/status", ReservaProdutoController.atualizarStatus);

module.exports = router;
