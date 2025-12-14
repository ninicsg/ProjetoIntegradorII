import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Servicos() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [novoServico, setNovoServico] = useState({ nome: "", preco: "" });

  const backgroundImageUrl = "/imgLogin.jpg"; 

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const response = await api.get("/servicos");
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  }

  async function adicionarServico(e) {
    e.preventDefault();
    if (!novoServico.nome || !novoServico.preco) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await api.post("/servicos", novoServico);
      setNovoServico({ nome: "", preco: "" });
      carregarServicos();
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        padding: "40px",
        
        backgroundImage: `url(${backgroundImageUrl})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundAttachment: 'fixed', 
      }}
    >
        <div
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px',
                padding: '30px 40px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                maxWidth: '800px',
                width: '100%',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: '2px solid #e91e63', 
            }}
        >
            <h2 style={{ marginBottom: "20px", color: '#e91e63' }}>Lista de Serviços</h2>

            <form
                onSubmit={adicionarServico}
                style={{
                display: "flex",
                gap: "10px",
                marginBottom: "30px",
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
            >
                <input
                type="text"
                placeholder="Nome do serviço"
                value={novoServico.nome}
                onChange={(e) =>
                    setNovoServico({ ...novoServico, nome: e.target.value })
                }
                style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    width: "180px",
                }}
                />
                <input
                type="number"
                placeholder="Preço"
                value={novoServico.preco}
                onChange={(e) =>
                    setNovoServico({ ...novoServico, preco: e.target.value })
                }
                style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    width: "100px",
                }}
                />
                <button
                type="submit"
                style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                }}
                >
                Adicionar
                </button>
            </form>

            <table
                style={{
                borderCollapse: "collapse",
                width: "100%", 
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "30px",
                }}
            >
                <thead>
                <tr style={{ backgroundColor: "#e91e63", color: "white" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Serviço</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Preço</th>
                </tr>
                </thead>
                <tbody>
                {servicos.length > 0 ? (
                    servicos.map((s) => (
                    <tr key={s.id}>
                        <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        {s.nome}
                        </td>
                        <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        R$ {Number(s.preco).toFixed(2)}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="2" style={{ textAlign: "center", padding: "12px" }}>
                        Nenhum serviço encontrado.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>

            <button
                onClick={() => navigate("/homeadmin")}
                style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#9c27b0",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                }}
            >
                Voltar para Home
            </button>
        </div>
    </div>
  );
}

export default Servicos;
