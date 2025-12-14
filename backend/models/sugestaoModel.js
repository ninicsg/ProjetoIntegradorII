const pool = require("../db/index.js");

const SugestaoModel = {
  async getAll() {
    const result = await pool.query(`
      SELECT s.*, u.nome AS usuario
      FROM Sugestao s
      LEFT JOIN Usuario u ON s.id_usuario = u.id_usuario
      ORDER BY s.data DESC;
    `);
    return result.rows;
  },

  async create({ texto, data, anonima, tipo_usuario, id_usuario }) {
    const result = await pool.query(
      `INSERT INTO Sugestao (texto, data, anonima, tipo_usuario, id_usuario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [texto, data, anonima, tipo_usuario, id_usuario]
    );
    return result.rows[0];
  },
};

module.exports = SugestaoModel;
