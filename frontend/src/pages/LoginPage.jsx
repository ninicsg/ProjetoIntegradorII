import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tipoUsuario = new URLSearchParams(location.search).get("tipo") || "cliente";

  const [isCadastro, setIsCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, senha, tipo_usuario: tipoUsuario });
      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert("Login realizado com sucesso!");

      if (usuario.tipo_usuario === "administrador") navigate("/homeadmin");
      else if (usuario.tipo_usuario === "funcionario") navigate("/homefuncionario");
      else navigate("/homecliente");
    } catch (error) {
      console.error("Erro no login:", error);
      alert(error.response?.data?.message || "Usuário ou senha incorretos.");
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      console.log("Tentando cadastrar usuário:", JSON.stringify({ nome, email, senha, tipo_usuario: tipoUsuario })  );
      const response = await api.post("/auth/register", {
        nome,
        email,
        senha,
        tipo_usuario: tipoUsuario,
      });

      alert("Cadastro realizado com sucesso!");
      setIsCadastro(false);
      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.response?.data?.message || "Erro ao cadastrar usuário.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        
        backgroundImage: "url('/imgLogin.jpg')", // Pega da pasta 'public'
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed" // Imagem fica parada ao rolar
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)", 
          padding: "40px 36px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#e75480",
            marginBottom: "24px",
            fontSize: "26px",
            fontWeight: "bold",
          }}
        >
          {isCadastro ? "Crie sua conta 💅" : "Bem-vindo(a)!"}
        </h1>

        <form onSubmit={isCadastro ? handleCadastro : handleLogin}>
          {isCadastro && (
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={inputEstilo}
              required
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputEstilo}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={inputEstilo}
            required
          />

          <button type="submit" style={botaoPrincipal}>
            {isCadastro ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
          {isCadastro ? "Já possui uma conta?" : "Ainda não tem conta?"}{" "}
          <button
            onClick={() => setIsCadastro(!isCadastro)}
            style={botaoLink}
          >
            {isCadastro ? "Entrar" : "Cadastre-se"}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputEstilo = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "14px",
  transition: "all 0.3s ease",
};

const botaoPrincipal = {
  backgroundColor: "#b61555",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
  fontSize: "15px",
  marginTop: "10px",
  transition: "0.3s",
};

const botaoLink = {
  backgroundColor: "transparent",
  color: "#b61555",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  textDecoration: "underline",
};

export default LoginPage;