import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import HomeAdmin from "./pages/HomeAdmin.jsx";
import Home from "./pages/Home.jsx";
import CadastroPage from "./pages/CadastroPage.jsx";
import Servicos from "./pages/Servicos.jsx";
import ClientePage from "./pages/ClientePage.jsx";
import AvaliacaoPage from "./pages/AvaliacaoPage.jsx"; 
import PrivateRoute from "./components/PrivateRoute.jsx";
import GerenciarClientes from "./pages/GerenciarClientes";
import EditarPerfilPage from "./pages/EditarPerfilPage.jsx";
import HomeFuncionario from "./pages/HomeFuncionario.jsx";
import AgendamentosFuncionario from "./pages/AgendamentosFuncionario.jsx";
import GerenciarClientesFuncionario from "./pages/GerenciarClientesFuncionario.jsx";
import AdminAgendamentos from "./pages/AdminAgendamentos";



function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homeadmin" element={<HomeAdmin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<CadastroPage />} />
      <Route path="/gerenciarclientes" element={<GerenciarClientes />} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/clientes" element={<ClientePage />} /> 
      <Route path="/homeadmin" element={<HomeAdmin />} />
      <Route path="/homecliente" element={<ClientePage />} />
      <Route path="/editarperfil" element={<EditarPerfilPage />} />
      <Route path="/homefuncionario" element={<HomeFuncionario />} />
      <Route path="/agendamentosfuncionario" element={<AgendamentosFuncionario />} />
      <Route path="gerenciarclientesfunc" element={<GerenciarClientesFuncionario />} />
      <Route path="/agendamentos" element={<AdminAgendamentos />} />
      <Route
        path="/clientes"
        element={
          <PrivateRoute>
            <ClientePage />
          </PrivateRoute>
        }
      />
      <Route path="/avaliacao/:id_agendamento" element={<AvaliacaoPage />} />
    </Routes>
  );
}

export default App;
