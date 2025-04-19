import { useState } from "react";
import { Todo } from "./TodoList";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoAction } from "@/actions/todo/actions";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isChecked, setIsChecked] = useState(false);
  //
  const queryClient = useQueryClient();

  const { mutate: updateTodo, isPending: isUpdation } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => updateTodoAction(todo._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  return (
    <div className="border rounded-2xl m-4 p-3 hover:bg-slate-100 duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-5">
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
          <div className="relative">
            <motion.h1
              className="text-2xl space-x-3 capitalize"
              animate={{
                opacity: isChecked ? 0.5 : 1,
                color: isChecked ? "rgb(156 163 175)" : "rgb(0 0 0)",
              }}
              transition={{ duration: 0.3 }}
            >
              {todo.body}
            </motion.h1>

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
        <div>
          <TodoState state={todo.completed} />
        </div>
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
      <div className="bg-yellow-300 px-4 py-1 rounded-full uppercase">
        In progress
      </div>
    );
  }
};
