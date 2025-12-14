const express = require("express");
const router = express.Router();
const ServicoController = require("../controllers/servicoController.js");

router.get("/", ServicoController.listar);
router.post("/", ServicoController.criar);
router.put("/:id", ServicoController.atualizar);
router.delete("/:id", ServicoController.deletar);

module.exports = router;

