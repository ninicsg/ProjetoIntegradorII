const Usuario = require("./usuarioModel");
const Funcionario = require('./funcionarioModel');
const Tratamento = require('./tratamentoModel');
const Agendamento = require('./agendamentoModel');
const Avaliacao = require('./avaliacaoModel');
const Pagamento = require('./pagamentoModel');
const Cliente = require('./clienteModel');

// Agendamento
Agendamento.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'clienteAgendamento' });
Agendamento.belongsTo(Usuario, { foreignKey: 'id_funcionario', as: 'funcionarioAgendamento' });
Agendamento.belongsTo(Tratamento, { foreignKey: 'id_tratamento', as: 'tratamentoAgendamento' });

// Avaliação
Avaliacao.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'clienteAvaliacao' });
Avaliacao.belongsTo(Usuario, { foreignKey: 'id_funcionario', as: 'funcionarioAvaliacao' });
Avaliacao.belongsTo(Agendamento, { foreignKey: 'id_agendamento', as: 'agendamentoAvaliacao' });

// Pagamento
Pagamento.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'clientePagamento' });
Pagamento.belongsTo(Usuario, { foreignKey: 'id_funcionario', as: 'funcionarioPagamento' });
Pagamento.belongsTo(Agendamento, { foreignKey: 'id_agendamento', as: 'agendamentoPagamento' });
Pagamento.belongsTo(Tratamento, { foreignKey: 'id_tratamento', as: 'tratamentoPagamento' });

module.exports = { Usuario, Funcionario, Tratamento, Agendamento, Avaliacao, Pagamento, Cliente };