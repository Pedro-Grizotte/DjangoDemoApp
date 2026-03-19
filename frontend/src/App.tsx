import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import Trabalhos from "./pages/jobs/Trabalhos";

const queryClient = new QueryClient();

function ConteudoAplicativo() {
  const { usuario, login, logout, trocarTipo } = useAuth();

  return (
    <>
      <Navbar usuario={usuario} onTrocaUsuario={trocarTipo} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Trabalhos user={usuario} />} />
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
