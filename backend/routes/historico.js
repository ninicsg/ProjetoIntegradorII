const express = require("express");
const router = express.Router();
const HistoricoController = require("../controllers/historicoController.js");

router.get("/", HistoricoController.listar);
router.post("/", HistoricoController.criar);

module.exports = router;
