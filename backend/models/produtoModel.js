const pool = require("../db/index.js");

const ProdutoModel = {
  async getAll() {
    const result = await pool.query("SELECT * FROM Produto ORDER BY id_produto");
    return result.rows;
  },

  async updateEstoque(id, quantidade) {
    const result = await pool.query(
      `UPDATE Produto SET quantidade_estoque = $1 WHERE id_produto = $2 RETURNING *`,
      [quantidade, id]
    );
    return result.rows[0];
  },
};

module.exports = ProdutoModel;
