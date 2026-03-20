import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import Trabalhos from "./pages/jobs/Trabalhos";
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";
import CardTrabalhoDetalhes from "./pages/jobs/CardTrabalhoDetalhes";
import TrabalhosEmpresa from "./pages/empresa/TrabalhosEmpresa";
import CriarEmpregos from "./pages/empresa/CriarEmpregos";
import EditarEmpregos from "./pages/empresa/EditarEmpregos";

const queryClient = new QueryClient();

function ConteudoAplicativo() {
  const { usuario, login, logout, trocarTipo } = useAuth();

  return (
    <>
      <Navbar usuario={usuario} onTrocaUsuario={trocarTipo} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Trabalhos user={usuario} />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/empregos/:id" element={<CardTrabalhoDetalhes user={usuario} />} />
        <Route path="/empresa/trabalhos" element={<TrabalhosEmpresa />} />
        <Route path="/empresa/trabalhos/novo" element={<CriarEmpregos />} />
        <Route path="/empresa/trabalhos/:id/editar" element={<EditarEmpregos />} />
      </Routes>
    </>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConteudoAplicativo />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
