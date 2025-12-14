const express = require("express");
const router = express.Router();
const FuncionarioController = require("../controllers/funcionarioController.js");

// rota get
router.get("/", FuncionarioController.listar);

// rota post 
router.post("/", FuncionarioController.criar);

// outras rotas
router.put("/:id", FuncionarioController.atualizar);
router.delete("/:id", FuncionarioController.deletar);

module.exports = router;