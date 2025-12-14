const ProdutoModel = require("../models/produtoModel.js");

const ProdutoController = {
  async listar(req, res) {
    try {
      const produtos = await ProdutoModel.getAll();
      res.json(produtos);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      res.status(500).json({ erro: "Erro ao listar produtos" });
    }
  },

  async criar(req, res) {
    try {
      const produto = await ProdutoModel.create(req.body);
      res.status(201).json(produto);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ erro: "Erro ao criar produto" });
    }
  },

  async atualizar(req, res) {
    try {
      const produto = await ProdutoModel.update(req.params.id, req.body);
      res.json(produto);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      res.status(500).json({ erro: "Erro ao atualizar produto" });
    }
  },

  async deletar(req, res) {
    try {
      await ProdutoModel.delete(req.params.id);
      res.json({ mensagem: "Produto excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      res.status(500).json({ erro: "Erro ao deletar produto" });
    }
  },
};

module.exports = ProdutoController;
