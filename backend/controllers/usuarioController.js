const UsuarioModel = require("../models/usuarioModel.js");

const UsuarioController = {
  // criar usuario
  async criar(req, res) {
    try {
      const novoUsuario = await UsuarioModel.create(req.body);
      res.status(201).json(novoUsuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  },

  // listar todos os Usuários
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ message: "Erro ao listar usuários" });
    }
  },

  // buscar usuario por id
  async buscarPorId(req, res) {
    try {
      const usuario = await UsuarioModel.findByPk(req.params.id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  },

  // atualizar Usuário
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const [atualizado] = await UsuarioModel.update(req.body, {
        where: { id_usuario: id }
      });

      if (atualizado) {
        const usuarioAtualizado = await UsuarioModel.findByPk(id);
        return res.json(usuarioAtualizado);
      }
      
      return res.status(404).json({ message: "Usuário não encontrado" });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  },

  // deletar Usuário
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await UsuarioModel.destroy({
        where: { id_usuario: id }
      });

      if (deletado) {
        return res.json({ message: "Usuário deletado com sucesso" });
      }

      return res.status(404).json({ message: "Usuário não encontrado" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  }
};

module.exports = UsuarioController;