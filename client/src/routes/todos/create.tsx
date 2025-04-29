import Sidebar from "@/components/navbar/Sidebar";
import CompletedTodos from "@/components/todo/CompletedTodos";
import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { useAuthStore, useTodoManagingWindowStore } from "@/zustand/store";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export interface AuthenticatedUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
export const Route = createFileRoute("/todos/create")({
  component: RouteComponent,
  beforeLoad: () => {
    const isUserAuthenticated = !!localStorage.getItem("token");

    if (!isUserAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  loader: async () => {
    const user: AuthenticatedUser = await JSON.parse(
      localStorage.getItem("user") || ""
    );
    return {
      user: user,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const { user } = Route.useLoaderData();
  const { isAuthenticated } = useAuthStore();

  const { pageName } = useTodoManagingWindowStore();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        to: "/login",
      });
    }
  }, [isAuthenticated]);

  return (
    <div className="flex gap-5 border-2 rounded-lg">
      <div className="flex-1">
        <Sidebar />
      </div>
      <div className="flex-2">
        {pageName === "" ? (
          <>
            <TodoForm user={user} />
            <TodoList />
          </>
        ) : (
          <CompletedTodos />
        )}
      </div>
    </div>
  );
}
