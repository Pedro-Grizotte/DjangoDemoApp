import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import Trabalhos from "./pages/jobs/Trabalhos";
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";
import CardTrabalhoDetalhes from "./pages/jobs/CardTrabalhoDetalhes";
import TrabalhosEmpresa from "./pages/empresa/TrabalhosEmpresa";
import CriarEmpregos from "./pages/empresa/CriarEmpregos";
import EditarEmpregos from "./pages/empresa/EditarEmpregos";
import EmpresaCandidatos from "./pages/empresa/EmpresaCandidatos";
import Relatorios from "./pages/reports/Relatorios";
import NaoEncontrado from "./pages/NaoEncontrado";

const queryClient = new QueryClient();

function ConteudoAplicativo() {
  const { usuario, login, logout } = useAuth();

  return (
    <>
      <Navbar usuario={usuario} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Trabalhos user={usuario} />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/empregos/:id" element={<CardTrabalhoDetalhes user={usuario} />} />
        <Route path="/empresa/trabalhos" element={<TrabalhosEmpresa />} />
        <Route path="/empresa/trabalhos/novo" element={<CriarEmpregos />} />
        <Route path="/empresa/trabalhos/:id/editar" element={<EditarEmpregos />} />
        <Route path="/empresa/trabalhos/:id/candidatos" element={<EmpresaCandidatos />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <ConteudoAplicativo />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
