module.exports = {

  FUNCIONARIO: {
    "/agendamentosfuncionario": ["GET", "POST", "PUT", "DELETE"],
    "/clientes": ["GET", "PUT"],
    "/usuarios": ["GET", "POST", "PUT", "DELETE"],
    "/funcionario": ["GET", "PUT"],
    "/produtos": ["GET", "POST", "PUT", "DELETE"],
    "/agendamentos": ["GET", "POST", "PUT", "DELETE"],
    "/pagamentos": ["POST", "PUT"],
    "/avaliacoes": ["GET", "POST", "PUT", "DELETE"],
    "/reservas": ["GET", "POST", "PUT", "DELETE"],
    "/sugestoes": ["GET", "POST", "PUT", "DELETE"],
    "/servicos": ["GET"]
  },

  CLIENTE: {
    "/agendamentos": ["GET", "POST", "PUT", "DELETE"],
    "/clientes": ["GET", "PUT"],
    "/usuarios": ["GET", "POST", "PUT", "DELETE"],
    "/funcionario": ["GET"],
    "/produtos": ["GET"],
    "/servicos": ["GET"],
    "/agendamentos": ["GET", "POST", "PUT", "DELETE"],
    "/pagamentos": ["POST", "PUT"],
    "/avaliacoes": ["GET", "POST", "PUT", "DELETE"],
    "/reservas": ["GET", "POST", "PUT", "DELETE"],
    "/sugestoes": ["GET", "POST", "PUT", "DELETE"]
  }
};
