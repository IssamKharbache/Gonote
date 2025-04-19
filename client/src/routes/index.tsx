import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main>
      <TodoForm />
      <TodoList />
    </main>
  );
}
