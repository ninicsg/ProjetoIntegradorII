const express = require("express");
const router = express.Router();
const SugestaoController = require("../controllers/sugestaoController.js");

router.get("/", SugestaoController.listar);
router.post("/", SugestaoController.criar);

module.exports = router;
