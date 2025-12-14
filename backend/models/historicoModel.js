const pool = require("../db/index.js");

const HistoricoModel = {
  async getAll() {
    const result = await pool.query(`
      SELECT h.*, a.data AS data_agendamento, u.nome AS cliente
      FROM Historico h
      JOIN Agendamento a ON h.id_agendamento = a.id_agendamento
      JOIN Cliente c ON a.id_cliente = c.id_usuario
      JOIN Usuario u ON c.id_usuario = u.id_usuario
      ORDER BY h.data DESC;
    `);
    return result.rows;
  },

  async create({ valor_pago, porcent_funcionario, porcent_salao, id_agendamento }) {
    const result = await pool.query(
      `INSERT INTO Historico (valor_pago, porcent_funcionario, porcent_salao, id_agendamento)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [valor_pago, porcent_funcionario, porcent_salao, id_agendamento]
    );
    return result.rows[0];
  },
};

module.exports = HistoricoModel;
