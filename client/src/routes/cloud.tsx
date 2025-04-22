import { fetchTodos } from "@/actions/todo/actions";
import EmptyTodoList from "@/components/homeUi/EmptyTodoList";
import RoutePendingLoader from "@/components/loaders/RoutePendingLoader";
import TodoItem from "@/components/todo/TodoItem";
import { Todo } from "@/components/todo/TodoList";
import { useAuthStore } from "@/zustand/store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/cloud")({
  component: RouteComponent,

  loader: async ({ context: { queryClient, userId } }) => {
    queryClient.prefetchQuery({
      queryKey: ["todos", userId],
      queryFn: () => fetchTodos(userId || ""),
    });
  },

  pendingComponent: () => <RoutePendingLoader />,
});

function RouteComponent() {
  const { user, isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const { data: todos } = useQuery<Todo[]>({
    queryKey: ["todos", user?.id],
    queryFn: () => fetchTodos(user?.id || ""),
  });

  const filteredTodos = todos?.filter((todo) => todo.completed);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (filteredTodos?.length === 0) {
    return <EmptyTodoList text={"You don't have any completed tasks"} />;
  }

  return (
    <section className="max-w-xl mx-auto mt-12">
      {filteredTodos?.map((todo) => (
        <div key={todo._id} className="m-3">
          <TodoItem todo={todo} isCloud={true} />
        </div>
      ))}
    </section>
  );
}
