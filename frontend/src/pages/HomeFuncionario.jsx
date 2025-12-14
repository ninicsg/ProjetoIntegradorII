import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeFuncionario.css";

function HomeFuncionario() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="funcionario-dashboard">
      <header className="header-dashboard">
        <h1 className="logo-dashboard">✨ Esmalteria</h1>
        <div className="header-info">
          <span className="usuario-nome">
            Olá, {user?.nome || "Funcionário"} 💅
          </span>
          <button onClick={handleLogout} className="btn-sair">Sair</button>
        </div>
      </header>

      <div className="funcionario-container">
        <div className="funcionario-card"> 
          <h2 className="subtitulo">Painel do Funcionário</h2>
          <div className="botoes-funcionario">
            <button
              onClick={() => navigate("/agendamentosfuncionario")}
              className="btn-dashboard azul"
            >
              📅 Ver Agendamentos
            </button>
            <button
              onClick={() => navigate("/gerenciarclientesfunc")}
              className="btn-dashboard rosa"
            >
              👥 Gerenciar Clientes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFuncionario;
