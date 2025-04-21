import { useState } from "react";
import { Todo } from "./TodoList";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoAction } from "@/actions/todo/actions";
import DeleteButton from "../buttons/DeleteButton";

const TodoItem = ({ todo, isCloud }: { todo: Todo; isCloud?: boolean }) => {
  const [isChecked, setIsChecked] = useState(false);
  //
  const queryClient = useQueryClient();

  const { mutate: updateTodo } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => await updateTodoAction(todo._id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);
      setIsChecked((prev) => !prev);

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    // Rollback to previous data on error
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  return (
    <div className="border rounded-2xl m-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          {!isCloud ? (
            <div className="relative flex items-center justify-center">
              {/* Custom checkbox styling */}
              <input
                onClick={() => updateTodo()}
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:border-none checked:bg-blue-500 transition-colors duration-200"
              />
              {/* Checkmark that appears when checked */}
              {isChecked && (
                <motion.svg
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-4 h-4 text-white pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </div>
          ) : null}

          <div className="relative">
            {!isCloud ? (
              <motion.h1
                className={`transition-opacity text-lg md:text-xl space-x-3 capitalize w-80 ${
                  isChecked
                    ? "opacity-50 text-gray-400"
                    : "text-black dark:text-white"
                }`}
                transition={{ duration: 0.3 }}
              >
                {todo.body}
              </motion.h1>
            ) : (
              <div className="text-lg md:text-2xl space-x-3 capitalize">
                {todo.body}
              </div>
            )}

            {/* Line animation */}
            {isChecked && (
              <motion.div
                className="absolute left-0 top-1/2 h-0.5 bg-gray-400 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              />
            )}
          </div>
        </div>
        {
          // Conditional rendering of the TodoState component
          !isCloud ? (
            <TodoState state={isChecked} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-green-400 px-4 py-1 rounded-full uppercase">
                Completed
              </div>
              <DeleteButton todo={todo} />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default TodoItem;

const TodoState = ({ state }: { state: boolean }) => {
  if (state) {
    return (
      <div className="bg-green-400 px-4 py-1 rounded-full uppercase">
        Completed
      </div>
    );
  } else {
    return (
      <div className="bg-yellow-300 px-4 py-1 rounded-full uppercase text-black">
        In progress
      </div>
    );
  }
};
