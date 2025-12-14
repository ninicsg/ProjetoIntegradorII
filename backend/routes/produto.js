const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/produtoController.js");

router.get("/", ProdutoController.listar);
router.post("/", ProdutoController.criar);
router.put("/:id", ProdutoController.atualizar);
router.delete("/:id", ProdutoController.deletar);

module.exports = router;
