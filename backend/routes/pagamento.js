
const express = require('express');
const router = express.Router();
const PagamentoController = require('../controllers/pagamentoController');
const { authMiddleware } = require('../middlewares/auth');

console.log("Controller importado:", PagamentoController);
console.log("GET LISTAR:", PagamentoController.listar);
console.log("POST CRIAR:", PagamentoController.criar);
console.log("AUTH:", authMiddleware);

router.get('/', authMiddleware, PagamentoController.listar);
router.post('/', authMiddleware, PagamentoController.criar);

module.exports = router;
