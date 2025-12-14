import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CadastroPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cep: "",
    tipo_usuario: "cliente",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCadastro = async (e) => {
        console.log("handleCadastro foi chamado");

    e.preventDefault();

    try {
      console.log("formData", formData);
      const response = await api.post("/auth/register", formData);

      if (response.data.success) {
        alert("Cadastro realizado com sucesso!");
        navigate("/"); 
      } else {
        alert("Erro: " + response.data.message);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao realizar cadastro. Verifique o console.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fdf2f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "36px 32px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#e75480", marginBottom: "18px" }}>Criar Conta</h1>

        <form
          onSubmit={handleCadastro}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            required
            value={formData.nome}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            required
            value={formData.senha}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            value={formData.cep}
            onChange={handleChange}
          />

          <button
            type="submit"
            style={{
              backgroundColor: "#e75480",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cadastrar
          </button>
        </form>

        <p style={{ marginTop: "18px", color: "#555" }}>Já tem conta?</p>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#fff0f6",
            color: "#e75480",
            border: "1px solid #e75480",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "6px",
          }}
        >
          Voltar para Login
        </button>
      </div>
    </div>
  );
}

export default CadastroPage;
