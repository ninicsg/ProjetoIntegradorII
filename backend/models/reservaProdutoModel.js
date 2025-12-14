const pool = require("../db/index.js");

const ReservaProdutoModel = {
  async getAll() {
    const result = await pool.query(`
      SELECT r.*, u.nome AS cliente, p.nome AS produto
      FROM ReservaProduto r
      JOIN Cliente c ON r.id_cliente = c.id_usuario
      JOIN Usuario u ON c.id_usuario = u.id_usuario
      JOIN Produto p ON r.id_produto = p.id_produto
      ORDER BY r.data_reserva DESC;
    `);
    return result.rows;
  },

  async create({ data_reserva, status, id_cliente, id_produto }) {
    const result = await pool.query(
      `INSERT INTO ReservaProduto (data_reserva, status, id_cliente, id_produto)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data_reserva, status, id_cliente, id_produto]
    );
    return result.rows[0];
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE ReservaProduto SET status = $1 WHERE id_reserva = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },
};

module.exports = ReservaProdutoModel;
