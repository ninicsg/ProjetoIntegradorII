import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeAdmin.css"; 
//import img from '../assets/img.jpg';
function HomeAdmin() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#fff0f6", 
        borderWidth: '12px',
        borderStyle: 'solid',
        borderImageSource: 'linear-gradient(45deg, #e75480, #E0BBE4, #ffc0cb)',
        borderImageSlice: 1,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          minHeight: "calc(100vh - 24px)", 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          boxSizing: "border-box", 

          backgroundImage: "url('/img.jpg')",          
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", 
          backgroundPosition: "center",
        }}
      >
        <div 
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)", 
            padding: "30px 40px",
            borderRadius: "15px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: '100%',
            maxWidth: '800px', 
            fontFamily: "Arial, sans-serif", 
          }}
        >
          <h1 style={{ color: "#e75480", marginBottom: "32px" }}>
            Painel do Administrador 💼
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            
            <button
              onClick={() => navigate("/gerenciarclientes")}
              style={{
                backgroundColor: "#e75480",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "16px 32px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              👥 Gerenciar Clientes
            </button>

            <button
              onClick={() => navigate("/servicos")}
              style={{
                backgroundColor: "#e75480",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "16px 32px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              💅 Gerenciar Serviços
            </button>

            <button
              onClick={() => navigate("/agendamentos")}
              style={{
                backgroundColor: "#e75480",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "16px 32px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              📅 Gerenciar Agendamentos
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "#fff0f6",
                color: "#e75480",
                border: "1px solid #e75480",
                borderRadius: "8px",
                padding: "16px 32px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              🚪 Sair
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
}

export default HomeAdmin;
