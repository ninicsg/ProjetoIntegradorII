import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js"; 
import "./AgendamentosFuncionario.css";

function AgendamentosFuncionario() {
  const [agendamentos, setAgendamentos] = useState([]);
  const navigate = useNavigate();

  const [idCliente, setIdCliente] = useState("");
  const [idTratamento, setIdTratamento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  // Listas para os selects
  const [listaClientes, setListaClientes] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);

  const funcionarioLogado = useMemo(
    () => JSON.parse(localStorage.getItem("usuario")),
    []
  );

  useEffect(() => {
    if (funcionarioLogado && funcionarioLogado.id_usuario) {
      fetchAgendamentos(funcionarioLogado.id_usuario);
    }
    carregarDadosParaFormulario();
  }, [funcionarioLogado]);

  async function confirmarAgendamento(id) {
    try {
      await api.put(`/agendamentos/${id}`, { status: "marcado" });
      alert("Agendamento marcado!");
      fetchAgendamentos(funcionarioLogado.id_usuario);
    } catch (error) {
      console.error("Erro ao marcar:", error);
      alert("Erro ao marcar agendamento. Verifique a conexão ou tente novamente.");
    }
  }

  const fetchAgendamentos = async (idFuncionario) => {
    try {
      const res = await api.get(
        `/agendamentosfuncionario?id_funcionario=${idFuncionario}`
      );
      setAgendamentos(res.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  const carregarDadosParaFormulario = async () => {
    try {
      const resClientes = await api.get("/clientes");
      const resServicos = await api.get("/servicos");

      setListaClientes(Array.isArray(resClientes.data) ? resClientes.data : []);
      setListaServicos(Array.isArray(resServicos.data) ? resServicos.data : []);
    } catch (error) {
      console.error("Erro ao carregar listas para formulário:", error);
      setListaClientes([]);
      setListaServicos([]);
    }
  };

  const handleAgendar = async (e) => {
    e.preventDefault();

    if (!idCliente || !idTratamento || !data || !hora) {
      alert("Por favor, preencha todos os campos do agendamento.");
      return;
    }

    // Validar se a data/hora é pelo menos 1 hora à frente
    const dataHoraAgendamento = new Date(`${data}T${hora}`);
    const agora = new Date();
    const umaHoraAFrente = new Date(agora.getTime() + 60 * 60 * 1000); // Adiciona 1 hora

    if (dataHoraAgendamento < umaHoraAFrente) {
      alert("⚠️ O agendamento deve ser feito com pelo menos 1 hora de antecedência.\n\nData/Hora mínima: " + 
            umaHoraAFrente.toLocaleString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            }));
      return;
    }

    try {
      await api.post("/agendamentos", {
        id_tratamento: idTratamento, 
        data: data,
        hora: hora,
        status: "pendente", 
        id_cliente: idCliente, 
        id_funcionario: funcionarioLogado.id_usuario, 
      });

      alert("✅ Agendamento criado com sucesso!");
      setIdCliente("");
      setIdTratamento("");
      setData("");
      setHora("");
      fetchAgendamentos(funcionarioLogado.id_usuario);
    } catch (error) {
      let mensagemErro = "Erro desconhecido ao agendar.";
        
        if (error.response) {
            mensagemErro = error.response.data.error || JSON.stringify(error.response.data);
            
            if (error.response.data.details) {
                mensagemErro += " Detalhes: " + error.response.data.details.join(", ");
            }
        } else if (error.request) {
            mensagemErro = "Erro de rede ou CORS: Nenhuma resposta do servidor.";
        }
        
        console.error("Erro ao criar agendamento:", error);
        alert("❌ " + mensagemErro); 
    }
  };
  
  const handleCancelar = async (idAgendamento) => {
      if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
          return;
      }

      try {
          await api.put(`/agendamentos/${idAgendamento}/cancelar`);
          
          setAgendamentos(prevAgendamentos => 
              prevAgendamentos.map(ag => 
                  ag.id_agendamento === idAgendamento 
                  ? { ...ag, status: 'cancelado' } 
                  : ag
              )
          );

          alert("Agendamento cancelado com sucesso!"); 

      } catch (error) {
          console.error("Erro ao cancelar agendamento:", error);
          let mensagemErro = "Erro ao cancelar. Verifique a conexão ou tente novamente.";
          if (error.response && error.response.data) {
             mensagemErro = error.response.data.error || mensagemErro;
          }
          alert(mensagemErro);
          fetchAgendamentos(funcionarioLogado.id_usuario); 
      }
  };

  return (
    <div className="agendamentos-dashboard">
      <header className="header-dashboard">
        <h1 className="logo-dashboard">📅 Agendamentos</h1>
        <button
          className="btn-voltar"
          onClick={() => navigate("/homefuncionario")}
        >
          ← Voltar
        </button>
      </header>

      <div className="agendamentos-container">
        <div className="agendamentos-card">
          <h2>Novo Agendamento</h2>
          <form onSubmit={handleAgendar} className="form-agendamento">
            <div className="form-grupo">
              <label>Cliente:</label>
              <select
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
              >
                <option value="">Selecione um Cliente</option>
                {Array.isArray(listaClientes) && listaClientes.map(c => (
                  <option key={c.id_usuario} value={c.id_usuario}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-grupo">
              <label>Serviço:</label>
              <select
                value={idTratamento}
                onChange={(e) => setIdTratamento(e.target.value)}
              >
                <option value="">Selecione um Serviço</option>
                {Array.isArray(listaServicos) && listaServicos.map(s => (
                  <option key={s.id_servico} value={s.id_servico}>
                    {s.nome} - R$ {Number(s.preco).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-grupo">
              <label>Data:</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div className="form-grupo">
              <label>Hora:</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-agendar-admin">
              Agendar
            </button>
          </form>
        </div>

        <div className="agendamentos-card">
          <h2>Lista de Agendamentos</h2>

          {agendamentos.length === 0 ? (
            <p>Nenhum agendamento encontrado.</p>
          ) : (
            <table className="tabela-agendamentos">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Serviço</th>
                  <th>Status</th>
                  <th>Gratuito</th>
                  <th>Ações</th> 
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((ag, i) => (
                  <tr key={i}>
                    <td><strong>{ag.nome_cliente}</strong></td>
                    <td>
                      {new Date(ag.data).toLocaleDateString("pt-BR")} às {ag.hora}
                    </td>
                    <td>{ag.tratamento}</td>
                    <td>
                      <span className={`status-badge ${ag.status}`}>
                        {ag.status}
                      </span>
                    </td>
                    <td>{ag.gratuito ? "Sim" : "Não"}</td>
                    <td>
                      {ag.status !== 'cancelado' && ag.status !== 'realizado' ? (
                        <>  
                        { ag.status !== "marcado" && (
                          <button
                            className="btn-confirmar"
                            onClick={() => confirmarAgendamento(ag.id_agendamento)}
                            title="Confirmar agendamento"
                          >
                            <span>✓</span> Confirmar
                          </button>
                        )}
                        <button
                          className="btn-cancelar"
                          onClick={() => handleCancelar(ag.id_agendamento)}
                          title="Cancelar agendamento"
                        >
                          <span>✕</span> Cancelar
                        </button>
                        </>
                      ) : (
                        <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgendamentosFuncionario;
