import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import InfinitePeople from "./people/InfinitePeople";
import InfiniteSpecies from "./species/InfiniteSpecies";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <h1>Infinite SWAPI</h1>
        <div className="app-content">
          <InfinitePeople />
          <InfiniteSpecies />
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
