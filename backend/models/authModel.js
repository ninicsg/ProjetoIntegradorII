const db = require("../db/index.js");
const bcrypt = require("bcrypt");
const { QueryTypes } = require("sequelize");

const AuthModel = {
  async register({ nome, email, telefone, cep, senha, tipo_usuario }) {
    try {
      const hashedPassword = await bcrypt.hash(senha, 10);

      const result = await db.query(
        `INSERT INTO usuario (nome, email, telefone, cep, senha, tipo_usuario)
         VALUES (:nome, :email, :telefone, :cep, :senha, :tipo_usuario)
         RETURNING id_usuario, nome, email, tipo_usuario`,
        {
          replacements: {
            nome,
            email,
            telefone: telefone || null,
            cep: cep || null,
            senha: hashedPassword,
            tipo_usuario: tipo_usuario || "cliente",
          },
          type: QueryTypes.INSERT,
        }
      );

      return result[0][0];
    } catch (error) {
      console.error("Erro no register:", error);
      throw error;
    }
  },

  async login(email, senha, tipo_usuario) {
    try {
      const usuarios = await db.query(
        "SELECT * FROM usuario WHERE email = :email AND tipo_usuario = :tipo_usuario",
        {
          replacements: { email, tipo_usuario },
          type: QueryTypes.SELECT,
        }
      );

      if (usuarios.length === 0) {
        return { success: false, message: "Usuário não encontrado para este tipo." };
      }

      const usuario = usuarios[0];
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return { success: false, message: "Senha incorreta." };
      }

      return { success: true, usuario };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: "Erro no servidor" };
    }
  },
};

module.exports = AuthModel;
