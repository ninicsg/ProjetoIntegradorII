const { query } = require('../db');

async function listTratamentos(req, res) {
  const r = await query('SELECT * FROM Tratamento ORDER BY id_tratamento');
  res.json(r.rows);
}

async function createTratamento(req, res) {
  const { nome, descricao, preco } = req.body;
  const r = await query('INSERT INTO Tratamento (nome,descricao,preco) VALUES ($1,$2,$3) RETURNING *', [nome, descricao, preco]);
  res.status(201).json(r.rows[0]);
}

async function updateTratamento(req, res) {
  const id = req.params.id;
  const { nome, descricao, preco } = req.body;
  const r = await query('UPDATE Tratamento SET nome=$1,descricao=$2,preco=$3 WHERE id_tratamento=$4 RETURNING *', [nome, descricao, preco, id]);
  res.json(r.rows[0]);
}

async function deleteTratamento(req, res) {
  const id = req.params.id;
  await query('DELETE FROM Tratamento WHERE id_tratamento=$1', [id]);
  res.status(204).send();
}

module.exports = { listTratamentos, createTratamento, updateTratamento, deleteTratamento };

