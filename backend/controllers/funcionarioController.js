const FuncionarioModel = require("../models/funcionarioModel.js");
const UsuarioModel = require("../models/usuarioModel.js");

const FuncionarioController = {
  
 //listar
  async listar(req, res) {
    try {
      const lista = await FuncionarioModel.findAll({
        include: [{
          model: UsuarioModel,
          attributes: ['nome', 'email', 'telefone'], // Traz dados do usuário
          required: true
        }]
      });

      // formata para facilitar o frontend
      const formatado = lista.map(f => ({
        id_usuario: f.id_usuario,
        nome: f.usuario.nome,
        email: f.usuario.email,
        cpf: f.cpf,
        area_atuacao: f.area_atuacao,
        status: f.status
      }));

      res.json(formatado);
    } catch (error) {
      console.error("Erro ao listar funcionários:", error);
      res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
  },

  //criar
  async criar(req, res) {
    try {
      const { nome, email, senha, telefone, cep, cpf, area_atuacao } = req.body;

      // criar o usuario base
      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha, 
        telefone,
        cep,
        tipo_usuario: 'funcionario' // força o tipo
      });

      //criar o vinculo na tabela funcionario
      const novoFuncionario = await FuncionarioModel.create({
        id_usuario: novoUsuario.id_usuario, // usa o id gerado acima
        cpf,
        area_atuacao,
        status: 'ativo'
      });

      res.status(201).json({ 
        message: "Funcionário criado com sucesso!",
        usuario: novoUsuario,
        dados_funcionario: novoFuncionario
      });

    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      res.status(500).json({ error: "Erro ao criar funcionário" });
    }
  },

  // atualizar
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, area_atuacao, status } = req.body;

      // atualiza dados basicos na tabela usuario
      await UsuarioModel.update({ nome, email }, { where: { id_usuario: id } });

      // atualiza dados especificos na tabela funcionario
      await FuncionarioModel.update({ area_atuacao, status }, { where: { id_usuario: id } });

      res.json({ message: "Funcionário atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
  },

  //deletar
  async deletar(req, res) {
    try {
      const { id } = req.params;
      
      await FuncionarioModel.destroy({ where: { id_usuario: id } });
      await UsuarioModel.destroy({ where: { id_usuario: id } });

      res.json({ message: "Funcionário removido com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar:", error);
      res.status(500).json({ error: "Erro ao deletar funcionário" });
    }
  }
};

module.exports = FuncionarioController;