import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/actions/todo/actions";
import { CgSpinner } from "react-icons/cg";
import TodoItem from "./TodoItem";
import EmptyTodoList from "../homeUi/EmptyTodoList";
import Swal from "sweetalert2";
import { useAuthStore } from "@/zustand/store";

export type Todo = {
  _id: string;
  body: string;
  completed: boolean;
  userId: string;
};
const TodoList = () => {
  const { user } = useAuthStore();
  //react query
  const {
    data: todos,
    error,
    isLoading,
  } = useQuery<Todo[]>({
    queryFn: () => fetchTodos(user?.id || ""),
    queryKey: ["todos", user?.id],
  });

  const filteredTodos = todos?.filter((todo) => !todo.completed);
  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto mt-24 ">
        <div className="flex items-center justify-center">
          <CgSpinner
            size={60}
            className="animate-spin text-blue-400 dark:text-blue-600"
          />
        </div>
      </div>
    );
  }
  if (!isLoading && filteredTodos?.length === 0) {
    return <EmptyTodoList text="You don't have any tasks" />;
  }
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: error.message || "Check your internet connection and try again !",
    });
  }
  return (
    <section className="max-w-2xl mx-auto">
      <div className="mr-5">
        {filteredTodos?.map((todo) => (
          <div key={todo._id}>
            <TodoItem todo={todo} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodoList;
