import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token encontrado no localStorage:", token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAgendamentosDoCliente = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const id_usuario = usuario?.id_usuario;

  if (!id_usuario) {
    throw new Error("Usuário não encontrado no localStorage");
  }

  const response = await api.get(`/agendamento/clientes/${id_usuario}`);
  return response.data;
};

export default api;