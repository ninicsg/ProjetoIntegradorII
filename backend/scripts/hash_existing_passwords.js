const pool = require("../db/index.js");
const bcrypt = require("bcrypt");

async function run() {
  try {
    const { rows } = await pool.query("SELECT id_usuario, senha FROM usuario");

    for (const row of rows) {
      const id = row.id_usuario;
      const senha = row.senha;

      if (typeof senha === "string" && (senha.startsWith("$2b$") || senha.startsWith("$2y$") || senha.startsWith("$2a$"))) {
        console.log(`id ${id}: já está com hash — pulando`);
        continue;
      }

      const novoHash = await bcrypt.hash(senha, 10);

      await pool.query("UPDATE usuario SET senha = $1 WHERE id_usuario = $2", [novoHash, id]);
      console.log(`id ${id}: senha atualizada`);
    }

    console.log("Migração concluída.");
    process.exit(0);
  } catch (err) {
    console.error("Erro na migração:", err);
    process.exit(1);
  }
}

run();
