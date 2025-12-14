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
      const response = await api.get("/homeadmin/gerenciarclientes");
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


  function iniciarEdicao(cliente) {
    setModoEdicao(true);
    setClienteAtual(cliente);
  }

  async function handleEditar(e) {
    e.preventDefault();
    try {
      await api.put(
        `/homeadmin/gerenciarclientes/${clienteAtual.id_usuario}`,
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
      await api.delete(`/homeadmin/gerenciarclientes/${id}`);
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
        padding: "40px",
        minHeight: "100vh",
        background: `url('/img.jpg') no-repeat center center fixed`,
        backgroundSize: 'contain',
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#ffffffff" }}>
        Gerenciar Clientes
      </h2>

      <div
        style={{
          width: "70%",
          maxWidth: "800px",
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.95)", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h3>{modoEdicao ? "Editar Cliente" : "Clique para editar um cliente"}</h3>

        <form onSubmit={modoEdicao ? handleEditar : (e) => e.preventDefault()}>
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
                required
              />
              <input
                name="email"
                placeholder="Email"
                value={clienteAtual.email}
                onChange={handleChange}
                type="email"
                required
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

            {modoEdicao && (
              <>
                <button
                  type="submit" 
                  style={{
                    backgroundColor: "#4c82afff",
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
                  type="button" 
                  onClick={resetarFormulario}
                  style={{
                    backgroundColor: "#cf4290ff",
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
            )}
        </form>
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          width: "70%",
          maxWidth: "800px",
          backgroundColor: "rgba(255, 255, 255, 0.9)", 
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
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
                      backgroundColor: "#49a4ceff",
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
                      backgroundColor: "#f43695ff",
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
        onClick={() => navigate("/homefuncionario")}
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
