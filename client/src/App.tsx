import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const App = () => {
  //initialising query client
  const client = new QueryClient();
  return (
    <main>
      <QueryClientProvider client={client}>
        <Navbar />
        <TodoForm />
        <TodoList />
      </QueryClientProvider>
    </main>
  );
};

export default App;
