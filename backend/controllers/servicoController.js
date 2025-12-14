const ServicoModel = require("../models/servicoModel.js");

const ServicoController = {
  async listar(req, res) {
    try {
      const servicos = await ServicoModel.findAll(); 
      
      res.json(servicos);
    } catch (error) {
      console.error("Erro ao listar serviços:", error);
      res.status(500).json({ erro: "Erro ao listar serviços" });
    }
  },

  async criar(req, res) {
    try {
      const novo = await ServicoModel.create(req.body);
      
      res.json(novo);
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      res.status(500).json({ erro: "Erro ao criar serviço" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      
      const [linhasAfetadas] = await ServicoModel.update(req.body, {
        where: { id_servico: id } 
      });

      if (linhasAfetadas === 0) {
        return res.status(404).json({ erro: "Serviço não encontrado" });
      }

      const atualizado = await ServicoModel.findByPk(id);
      res.json(atualizado);

    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      res.status(500).json({ erro: "Erro ao atualizar serviço" });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      const deletado = await ServicoModel.destroy({
        where: { id_servico: id }
      });

      if (deletado === 0) {
        return res.status(404).json({ erro: "Serviço não encontrado" });
      }

      res.json({ mensagem: "Serviço deletado com sucesso" });
      
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      res.status(500).json({ erro: "Erro ao deletar serviço" });
    }
  },
};

module.exports = ServicoController;