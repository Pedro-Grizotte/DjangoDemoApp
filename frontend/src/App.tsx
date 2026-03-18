import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

function ConteudoAplicativo() {
  const { usuario, login, logout, trocarTipo } = useAuth();

  return (
    <>
      <Navbar usuario={usuario} onTrocaUsuario={trocarTipo} onLogout={logout} />
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
