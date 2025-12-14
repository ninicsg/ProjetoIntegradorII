const Agendamento = require('./agendamentoModel');
const Usuario = require('./usuarioModel');
const Tratamento = require('./tratamentoModel'); 

console.log("Definindo associações");

// Agendamento Cliente
Agendamento.belongsTo(Usuario, { 
    foreignKey: 'id_cliente', 
    as: 'cliente' 
});

// Agendamento Funcionário
Agendamento.belongsTo(Usuario, { 
    foreignKey: 'id_funcionario', 
    as: 'funcionario' 
});

// Agendamento Tratamento
Agendamento.belongsTo(Tratamento, { 
    foreignKey: 'id_tratamento', 
    as: 'tratamento' 
});

module.exports = {
    Agendamento,
    Usuario,
    Tratamento,
};
