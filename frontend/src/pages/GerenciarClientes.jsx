import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function GerenciarClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [clienteAtual, setClienteAtual] = useState({
    id_usuario: null,
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    senha: "",
    pontos_fidelidade: 0,
  });

  async function fetchClientes() {
    try {
      const response = await api.get("http://localhost:4000/homeadmin/gerenciarclientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      alert("Erro ao conectar ao servidor.");
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setClienteAtual((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAdicionar() {
    try {
      await api.post("http://localhost:4000/homeadmin/gerenciarclientes", clienteAtual);
      alert("✅ Cliente adicionado com sucesso!");
      resetarFormulario();
      fetchClientes();
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      alert("Erro ao adicionar cliente.");
    }
  }

  function iniciarEdicao(cliente) {
    setModoEdicao(true);
    setClienteAtual(cliente);
  }

  async function handleEditar() {
    try {
      await api.put(
        `http://localhost:4000/homeadmin/gerenciarclientes/${clienteAtual.id_usuario}`,
        clienteAtual
      );
      alert("✏️ Cliente atualizado com sucesso!");
      resetarFormulario();
      fetchClientes();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert("Erro ao atualizar cliente.");
    }
  }

  async function handleExcluir(id) {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;

    try {
      await api.delete(`http://localhost:4000/homeadmin/gerenciarclientes/${id}`);
      alert("🗑️ Cliente excluído com sucesso!");
      fetchClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir cliente.");
    }
  }

  function resetarFormulario() {
    setModoEdicao(false);
    setClienteAtual({
      id_usuario: null,
      nome: "",
      email: "",
      telefone: "",
      cep: "",
      senha: "",
      pontos_fidelidade: 0,
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "40px",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#e91e63" }}>
        Gerenciar Clientes
      </h2>

      <div
        style={{
          width: "70%",
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>{modoEdicao ? "Editar Cliente" : "Adicionar Novo Cliente"}</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <input
            name="nome"
            placeholder="Nome"
            value={clienteAtual.nome}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={clienteAtual.email}
            onChange={handleChange}
          />
          <input
            name="telefone"
            placeholder="Telefone"
            value={clienteAtual.telefone}
            onChange={handleChange}
          />
          <input
            name="cep"
            placeholder="CEP"
            value={clienteAtual.cep}
            onChange={handleChange}
          />
        </div>

        {modoEdicao ? (
          <>
            <button
              onClick={handleEditar}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Salvar Alterações
            </button>
            <button
              onClick={resetarFormulario}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={handleAdicionar}
            style={{
              backgroundColor: "#2196f3",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Adicionar Cliente
          </button>
        )}
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          width: "70%",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e91e63", color: "white" }}>
            <th style={{ padding: "12px" }}>Nome</th>
            <th style={{ padding: "12px" }}>Telefone</th>
            <th style={{ padding: "12px" }}>Pontos</th>
            <th style={{ padding: "12px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((c) => (
              <tr key={c.id_usuario}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {c.nome}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {c.telefone}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {c.pontos_fidelidade}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => iniciarEdicao(c)}
                    style={{
                      backgroundColor: "#ff9800",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      color: "white",
                      marginRight: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(c.id_usuario)}
                    style={{
                      backgroundColor: "#f44336",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "12px" }}>
                Nenhum cliente encontrado.
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
  );
}

export default GerenciarClientes;
