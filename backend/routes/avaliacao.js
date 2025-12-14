const express = require("express");
const router = express.Router();
const AvaliacaoController = require("../controllers/avaliacaoController.js");

router.get("/", AvaliacaoController.listar);
router.post("/", AvaliacaoController.criar);

module.exports = router;
