import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";
import "./AvaliacaoPage.css";

export default function AvaliacaoPage() {
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const navigate = useNavigate();

  const { id_agendamento } = useParams(); // PEGOU O ID DA URL

  const handleEnviar = async (e) => {
    e.preventDefault();

    try {
      await api.post("/avaliacoes", {
        nota,
        comentario,
        id_agendamento: Number(id_agendamento),
      });

      alert("Avaliação enviada com sucesso!");
      navigate("/homecliente");

    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação.");
    }
  };
  return (
    <div className="avaliacao-container">
      <header className="header">
        <button className="botao-voltar" onClick={() => navigate("/homecliente")}>
          ⬅ Voltar
        </button>
        <h1 className="logo">Esmalteria</h1>
      </header>

      <div className="avaliacao-card">
        <h2 className="avaliacao-title">Deixe sua Avaliação</h2>

        <form onSubmit={handleEnviar}>
          <label className="avaliacao-label">Nota</label>
          <select
            className="avaliacao-select"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            <option value="1">1 - Ruim</option>
            <option value="2">2 - Regular</option>
            <option value="3">3 - Bom</option>
            <option value="4">4 - Muito Bom</option>
            <option value="5">5 - Excelente</option>
          </select>

          <label className="avaliacao-label">Comentário</label>
          <textarea
            className="avaliacao-textarea"
            placeholder="Escreva seu comentário..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          ></textarea>

          <div className="avaliacao-botoes">
            <button type="submit" className="botao-enviar">
              Enviar
            </button>
            <button
              type="button"
              className="botao-cancelar"
              onClick={() => {
                setNota("");
                setComentario("");
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <footer className="footer">
        <p>© 2025 Esmalteria Maria Luiza | Cuidando com carinho 💖</p>
      </footer>
    </div>
  );
}
