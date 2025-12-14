const express = require("express");
const router = express.Router();

// importação correta: pega o objeto commpleto AgendamentoFuncionarioController
// que foi exportado como um modulo.
const AgendamentoFuncionarioController = require("../controllers/agendamentoFuncionarioController.js");

// define a rota GET para a URL base (que é /agendamentosfuncionario no server.js).
// acessa o metodo listar do objeto importado.
router.get("/", AgendamentoFuncionarioController.listar);

module.exports = router;