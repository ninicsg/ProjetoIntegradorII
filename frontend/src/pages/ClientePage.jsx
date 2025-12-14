import { useEffect, useState, useMemo } from "react"; 
import { useNavigate } from "react-router-dom";
import api from "../api/api";

// Componente para o card de funcionário com hover
function FuncionarioCard({ funcionario, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    ...styles.funcionarioCard,
    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 8px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
    borderColor: isHovered ? '#e91e63' : '#ffc1e3'
  };

  const buttonStyle = {
    ...styles.selecionarButton,
    backgroundColor: isHovered ? '#6a1b9a' : '#4a148c'
  };

  return (
    <div 
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.funcionarioIcon}>👤</div>
      <h3 style={styles.funcionarioNome}>{funcionario.nome}</h3>
      <p style={styles.funcionarioEmail}>{funcionario.email}</p>
      <button style={buttonStyle}>
        Selecionar
      </button>
    </div>
  );
}

// Componente para o botão de fechar com hover
function CloseButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    ...styles.closeButton,
    backgroundColor: isHovered ? '#ffebee' : 'transparent'
  };

  return (
    <button 
      onClick={onClick} 
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      ✕
    </button>
  );
}

export default function ClientePage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [secaoAtiva, setSecaoAtiva] = useState("inicio");
  
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horaSelecionada, setHoraSelecionada] = useState('');
  
  // Estados para o modal de funcionários
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const user = useMemo(() => {
      const userData = localStorage.getItem("usuario");
      if (userData) {
          try {
              console.log("Usuário encontrado no localStorage:", userData);
              return JSON.parse(userData);
          } catch (e) {
              console.error("Erro ao fazer parse do usuário do localStorage", e);
              return null;
          }
      }
      return null;
  }, []); 

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    async function carregarAgendamentos() {
      try {
        const res = await api.get(`/agendamentos/clientes/${user.id_usuario}`);
        setAgendamentos(res.data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      }
    }

    carregarAgendamentos();
  }, [user]); 

  async function carregarServicos() {
    try {
      const res = await api.get("/servicos");
      setServicos(res.data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  }

  async function carregarFuncionarios() {
    try {
      const res = await api.get("/funcionarios");
      setFuncionarios(res.data);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      alert("Erro ao carregar lista de funcionários.");
    }
  }

  const abrirModalFuncionarios = async (id_tratamento) => {
    if (!dataSelecionada || !horaSelecionada) {
      alert("Por favor, selecione a Data e a Hora desejadas para o agendamento.");
      return;
    }

    // Validar se a data/hora é pelo menos 1 hora à frente
    const dataHoraAgendamento = new Date(`${dataSelecionada}T${horaSelecionada}`);
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
    
    setServicoSelecionado(id_tratamento);
    await carregarFuncionarios();
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setServicoSelecionado(null);
  };

  const handleMostrarServicos = () => {
    setSecaoAtiva("novo");
    
    const today = new Date().toISOString().split('T')[0];
    setDataSelecionada(today); 
    setHoraSelecionada(''); 
    
    carregarServicos();
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };


async function agendarServico(id_funcionario) {
  
  if (!servicoSelecionado) {
      alert("Erro interno: ID do serviço não foi fornecido. Por favor, tente novamente.");
      return;
  }

  if (!id_funcionario) {
      alert("Por favor, selecione um funcionário.");
      return;
  }

  try {
    console.log("Agendando serviço com os dados:", {
      id_tratamento: servicoSelecionado, 
      data: dataSelecionada,
      hora: horaSelecionada, 
      status: "pendente", 
      id_cliente: user.id_usuario,
      id_funcionario: id_funcionario 
    });
    
    await api.post("/agendamentos", {
      id_tratamento: servicoSelecionado, 
      data: dataSelecionada,
      hora: horaSelecionada, 
      status: "pendente", 
      id_cliente: user.id_usuario,
      id_funcionario: id_funcionario 
    });

    fecharModal();
    alert("Serviço agendado com sucesso! Aguarde a confirmação.");
    setSecaoAtiva("agendamentos");
    const res = await api.get(`/agendamentos/clientes/${user.id_usuario}`);
    setAgendamentos(res.data);
  } catch (error) {
    console.error("Erro completo ao agendar serviço:", error);
    
    let serverMessage = "Erro ao agendar serviço. Verifique o console para mais detalhes.";
    
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (data && data.error) {
            serverMessage = `[${status}] Erro do Servidor: ${data.error}`;
        } else if (data && data.message) {
             serverMessage = `[${status}] Erro do Servidor: ${data.message}`;
        } else if (status === 400) {
            serverMessage = "Erro 400: Dados inválidos (Verifique se a data/hora já estão ocupadas ou se o ID do funcionário existe).";
        } else if (status === 404) {
            serverMessage = "Erro 404: Rota de agendamentos não encontrada (URL incorreta).";
        } else if (status === 500) {
            serverMessage = "Erro 500: Erro interno no servidor. Consulte o console do backend.";
        }
    }
    
    alert(serverMessage);
  }
}

  return (
    <div 
      style={styles.clienteDashboard}
    >
      <header 
        style={styles.headerDashboard}
      >
        <h1 style={styles.logoDashboard}>✨Esmalteria</h1>
        <div style={styles.headerInfo}>
          <span style={styles.usuarioNome}>
            Olá, {user?.nome || "Cliente"} 💅
          </span>
          <button 
            onClick={handleLogout} 
            style={styles.btnSair}
          >
            Sair
          </button>
        </div>
      </header>

      <div 
        style={styles.clienteContainer}
      >
        <div 
          style={styles.dashboardBotoes}
        >
          <button
            onClick={() => setSecaoAtiva("agendamentos")}
            style={buttonStyle("#e91e63", secaoAtiva === "agendamentos")}
          >
            📅 Meus Agendamentos
          </button>

          <button
            onClick={handleMostrarServicos}
            style={buttonStyle("#03a9f4", secaoAtiva === "novo")}
          >
            💅 Agendar Serviço
          </button>

          <button
            onClick={() => setSecaoAtiva("fidelidade")}
            style={buttonStyle("#9c27b0", secaoAtiva === "fidelidade")}
          >
            💖 Meus Pontos
          </button>

          <button
            onClick={() => setSecaoAtiva("perfil")}
            style={buttonStyle("#4caf50", secaoAtiva === "perfil")}
          >
            ⚙️ Meu Perfil
          </button>
        </div>

        <div 
          style={styles.dashboardConteudo}
        >
          {secaoAtiva === "inicio" && (
            <p style={styles.mensagemInicial}>
              Selecione uma das opções ao lado para começar ✨
            </p>
          )}

          {secaoAtiva === "agendamentos" && (
            <>
              <h2 style={styles.titleStyle}>📋 Seus Agendamentos</h2>
              {agendamentos.length === 0 ? (
                <p style={styles.mensagemVazia}>
                  Nenhum agendamento encontrado.
                </p>
              ) : (
                <table style={styles.tableStyle}>
                  <thead>
                    <tr style={styles.tableHeaderStyle}>
                      <th style={styles.tableCellStyle}>Serviço</th>
                      <th style={styles.tableCellStyle}>Data</th>
                      <th style={styles.tableCellStyle}>Hora</th>
                      <th style={styles.tableCellStyle}>Status</th>
                      <th style={styles.tableCellStyle}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((a) => (
                      <tr key={a.id_agendamento}>
                        <td style={styles.tableCellStyle}>{a.tratamento?.nome || a.id_tratamento}</td>
                        <td style={styles.tableCellStyle}>{new Date(a.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                        <td style={styles.tableCellStyle}>{a.hora}</td>
                        <td style={styles.tableCellStyle}>{a.status}</td>
                        <td style={styles.tableCellStyle}>
                          <button
                            onClick={() =>
                              navigate(`/avaliacao/${a.id_agendamento}`)
                            }
                            style={styles.buttonLinkStyle}
                          >
                            ✨ Avaliar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {secaoAtiva === "novo" && (
            <div className="secao-novo">
              <h2 style={styles.titleStyle}>💅 Escolha a Data, Hora e Serviço</h2>
              
              <div style={styles.dateSelectorContainer}>
                <div style={styles.dateInputWrapper}>
                    <label style={styles.dateLabel}>Data Desejada:</label>
                    <input 
                        type="date" 
                        value={dataSelecionada} 
                        onChange={(e) => setDataSelecionada(e.target.value)} 
                        required 
                        style={styles.inputStyle}
                    />
                </div>
                <div style={styles.dateInputWrapper}>
                    <label style={styles.dateLabel}>Hora Desejada:</label>
                    <input 
                        type="time" 
                        value={horaSelecionada} 
                        onChange={(e) => setHoraSelecionada(e.target.value)} 
                        required 
                        style={styles.inputStyle}
                    />
                </div>
              </div>
              
              {servicos.length === 0 ? (
                <p style={styles.mensagemInicial}>
                  Carregando lista de serviços...
                </p>
              ) : (
                <table style={styles.tableStyle}>
                  <thead>
                    <tr style={styles.tableHeaderStyle}>
                      <th style={styles.tableCellStyle}>Serviço</th>
                      <th style={styles.tableCellStyle}>Preço</th>
                      <th style={styles.tableCellStyle}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map((s) => (
                      <tr key={s.id_servico}>
                        <td style={styles.tableCellStyle}>{s.nome}</td>
                        <td style={styles.tableCellStyle}>R$ {Number(s.preco).toFixed(2)}</td>
                        <td style={styles.tableCellStyle}>
                          <button
                            onClick={() => abrirModalFuncionarios(s.id_servico)}
                            style={styles.buttonLinkStyle}
                            disabled={!dataSelecionada || !horaSelecionada} 
                          >
                            💅 Agendar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {secaoAtiva === "fidelidade" && (
            <div className="secao-fidelidade">
              <h2 style={styles.titleStyle}>💖 Programa de Fidelidade</h2>
              <p>
                Você possui{" "}
                <strong style={styles.emphasisText}>{user?.pontos_fidelidade || 0}</strong> pontos!
              </p>
              <p>
                Ganhe pontos a cada agendamento e troque por descontos
                exclusivos!
              </p>
            </div>
          )}

          {secaoAtiva === "perfil" && (
            <div className="secao-perfil">
              <h2 style={styles.titleStyle}>⚙️ Meus Dados</h2>
              <p>
                <strong>Nome:</strong> {user?.nome}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Telefone:</strong>{" "}
                {user?.telefone || "Não informado"}
              </p>
              <p>
                <strong>CEP:</strong> {user?.cep || "Não informado"}
              </p>
              <button
                onClick={() => navigate("/editarperfil")}
                style={styles.buttonLinkStyle}
              >
                ✏️ Editar Perfil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de seleção de funcionário */}
      {modalAberto && (
        <div style={styles.modalOverlay} onClick={fecharModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>👤 Escolha um Funcionário</h2>
              <CloseButton onClick={fecharModal} />
            </div>
            
            <div style={styles.modalBody}>
              {funcionarios.length === 0 ? (
                <p style={styles.mensagemInicial}>Carregando funcionários...</p>
              ) : (
                <div style={styles.funcionariosGrid}>
                  {funcionarios.map((func) => (
                    <FuncionarioCard
                      key={func.id_usuario}
                      funcionario={func}
                      onClick={() => agendarServico(func.id_usuario)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



const styles = {
    clienteDashboard: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Inter, sans-serif',
        minHeight: "100vh",
        background: `url('/imgLogin.jpg') no-repeat center fixed`, 
        backgroundSize: 'contain',
    },
    headerDashboard: {
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        marginBottom: '20px',
        backgroundColor: '#ffc1e3',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    logoDashboard: {
        fontSize: '24px', 
        color: '#880e4f'
    },
    headerInfo: {
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px' 
    },
    usuarioNome: {
        color: '#4a148c', 
        fontWeight: 'bold'
    },
    btnSair: {
        backgroundColor: '#4a148c',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    clienteContainer: {
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        gap: '20px'
    },
    dashboardBotoes: {
        flex: '0 0 250px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    dashboardConteudo: {
        flex: 1,
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    mensagemInicial: {
        textAlign: 'center', 
        color: '#666'
    },
    titleStyle: {
        fontSize: '20px',
        color: '#880e4f',
        marginBottom: '20px',
        borderBottom: '2px solid #ffc1e3',
        paddingBottom: '10px'
    },
    mensagemVazia: {
        color: '#f44336',
        padding: '10px',
        backgroundColor: '#ffebee',
        borderRadius: '5px'
    },
    tableStyle: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeaderStyle: {
        backgroundColor: '#ffc1e3',
        color: '#880e4f',
        fontWeight: 'bold',
        textAlign: 'left'
    },
    tableCellStyle: {
        padding: '12px',
        borderBottom: '1px solid #eee'
    },
    buttonLinkStyle: {
        backgroundColor: '#4a148c',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    inputStyle: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    dateSelectorContainer: {
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px', 
        padding: '15px', 
        border: '1px solid #ffc1e3', 
        borderRadius: '8px', 
        backgroundColor: '#fffbe5'
    },
    dateInputWrapper: {
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1 
    },
    dateLabel: {
        marginBottom: '5px', 
        fontWeight: 'bold', 
        color: '#e91e63'
    },
    emphasisText: {
        color: '#e91e63'
    },
    // Estilos do Modal
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '0',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 25px',
        borderBottom: '2px solid #ffc1e3',
        backgroundColor: '#fff0f6'
    },
    modalTitle: {
        margin: 0,
        color: '#880e4f',
        fontSize: '22px'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        color: '#880e4f',
        padding: '0',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'background-color 0.2s'
    },
    modalBody: {
        padding: '25px',
        overflowY: 'auto'
    },
    funcionariosGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px'
    },
    funcionarioCard: {
        border: '2px solid #ffc1e3',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    funcionarioIcon: {
        fontSize: '48px',
        marginBottom: '10px'
    },
    funcionarioNome: {
        margin: '10px 0 5px 0',
        color: '#880e4f',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    funcionarioEmail: {
        margin: '5px 0 15px 0',
        color: '#666',
        fontSize: '14px'
    },
    selecionarButton: {
        backgroundColor: '#4a148c',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
        transition: 'background-color 0.3s'
    }
};

const buttonStyle = (color, isActive) => ({
  backgroundColor: isActive ? color : '#f0f0f0',
  color: isActive ? 'white' : '#333',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
  boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
  textAlign: 'left'
});
