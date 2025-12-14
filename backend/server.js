const {authMiddleware} = require("./middlewares/auth.js");
const {routePermission} = require("./middlewares/routePermission.js");
const express = require("express");
require('./models/associations');
const cors = require("cors");
const dotenv = require("dotenv");

require('./cron'); // apenas para carregar o cron job

//configuracoes iniciais
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000; // define a porta de fallback

//importacao de rotas
const authRoutes = require("./routes/auth.js");
const servicosRoutes = require("./routes/servico.js");
const clientesRoutes = require("./routes/clientes.js");
const usuarioRoutes = require("./routes/usuario.js");
const agendamentosFuncionarioRoutes = require("./routes/agendamentoFuncionario.js");
const funcionarioRoutes = require("./routes/funcionario.js");
const produtoRoutes = require("./routes/produto.js");
const agendamentoRoutes = require("./routes/agendamento.js");
const pagamentoRoutes = require("./routes/pagamento.js");
const avaliacaoRoutes = require("./routes/avaliacao.js");
const reservaRoutes = require("./routes/reservaProduto.js");
const historicoRoutes = require("./routes/historico.js");
const sugestaoRoutes = require("./routes/sugestao.js");


app.use(express.json()); // aqui habilita o parsing de json no corpo da requisicao

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use(authMiddleware);
app.use(routePermission);

//definição das rotas (só uma vez)
app.use("/servicos", servicosRoutes);
app.use("/usuarios", usuarioRoutes);

// rotas principais
app.use("/agendamentos", agendamentoRoutes);
app.use("/funcionarios", funcionarioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/pagamentos", pagamentoRoutes);
app.use("/avaliacoes", avaliacaoRoutes);
app.use("/reservas", reservaRoutes);
app.use("/historico", historicoRoutes);
app.use("/sugestoes", sugestaoRoutes);

//rotas especificas/aninhadas
app.use("/agendamentosfuncionario", agendamentosFuncionarioRoutes);
app.use("/clientes", clientesRoutes); // Mantido o nome simples, mas pode ser usado na rota aninhada
app.use("/homeadmin/gerenciarclientes", clientesRoutes);


//inicializacao do servidor (so uma chamada)
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));