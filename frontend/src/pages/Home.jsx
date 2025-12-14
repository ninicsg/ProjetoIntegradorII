import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff0f6",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          backgroundColor: "#e75480",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: 0 }}>Esmalteria </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "white",
            color: "#e75480",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h2 style={{ color: "#e75480", marginBottom: "20px" }}>
            Bem-vinda à Esmalteria 
          </h2>
          <p style={{ color: "#555", marginBottom: "30px" }}>
            Aqui você pode gerenciar seus agendamentos, clientes e serviços com
            praticidade e estilo.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => navigate("/agendamentos")}
              style={{
                backgroundColor: "#cabec2ff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📅 Agendamentos
            </button>

            <button
              onClick={() => navigate("/clientes")}
              style={{
                backgroundColor: "#fff0f6",
                color: "#e75480",
                border: "1px solid #e75480",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              💇‍♀️ Clientes
            </button>


            <button
              onClick={() => navigate("/servicos")} 
              style={{
                padding: "12px 24px",
                backgroundColor: "#9c27b0",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
          Serviços
        </button>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;