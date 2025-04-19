import { fetchTodos } from "@/actions/todo/actions";
import EmptyTodoList from "@/components/homeUi/EmptyTodoList";
import TodoItem from "@/components/todo/TodoItem";
import { Todo } from "@/components/todo/TodoList";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cloud")({
  component: RouteComponent,
  loader: async () => {
    const todos: Todo[] = await fetchTodos();
    return {
      todos: todos,
    };
  },

  pendingComponent: () => <div className="text-5xl">Loading ....</div>,
});

function RouteComponent() {
  const { todos: initialTodos } = Route.useLoaderData();

  const { data: todos } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialData: initialTodos,
  });

  const filteredTodos = todos.filter((todo) => todo.completed);

  if (filteredTodos.length === 0) {
    return <EmptyTodoList text={"You don't have any completed tasks"} />;
  }
  return (
    <section className="max-w-xl mx-auto mt-12">
      <div>
        {filteredTodos?.map((todo) => (
          <div key={todo._id}>
            <TodoItem todo={todo} isCloud={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
