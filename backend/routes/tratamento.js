
const express = require('express');
const router = express.Router();
const { listTratamentos, createTratamento, updateTratamento, deleteTratamento } = require('../controllers/tratamentoController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, listTratamentos);
router.post('/', authMiddleware, createTratamento);
router.put('/:id', authMiddleware, updateTratamento);
router.delete('/:id', authMiddleware, deleteTratamento);

module.exports = router;

