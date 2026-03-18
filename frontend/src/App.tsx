import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function ConteudoAplicativo() {
  return (
    <div>
      <p>Primeiros Passos!</p>
    </div>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConteudoAplicativo />
  </QueryClientProvider>
);

export default App;
