import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/actions/todo/actions";
import { CgSpinner } from "react-icons/cg";
import TodoItem from "./TodoItem";

export type Todo = {
  _id: number;
  body: string;
  completed: boolean;
};
const TodoList = () => {
  //react query
  const {
    data: todos,
    error,
    isLoading,
  } = useQuery<Todo[]>({
    queryFn: () => fetchTodos(),
    queryKey: ["todos"],
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
  return (
    <section className="max-w-xl mx-auto mt-12">
      <div>
        {filteredTodos.map((todo) => (
          <div key={todo._id}>
            <TodoItem todo={todo} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodoList;
