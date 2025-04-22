import { useState } from "react";
import { Todo } from "./TodoList";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoAction } from "@/actions/todo/actions";
import DeleteButton from "../buttons/DeleteButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { capitalizeFirstLetterOfTheString } from "@/lib/utils";
import EditTodo from "./EditTodo";
import { useUpdateTodoDialogStore } from "@/zustand/store";

const TodoItem = ({ todo, isCloud }: { todo: Todo; isCloud?: boolean }) => {
  const [isChecked, setIsChecked] = useState(false);
  const queryClient = useQueryClient();
  const { isOpen, setIsOpen } = useUpdateTodoDialogStore();

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
      queryClient.invalidateQueries({ queryKey: ["todos", todo.userId] });
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", todo.userId] });
    },
  });

  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div className="border rounded-2xl p-3 hover:bg-slate-100 dark:hover:bg-slate-800 duration-300 w-full m-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left side - Checkbox and Text */}
          <div className="flex items-center gap-5 flex-1">
            {/* Only show checkbox if not in cloud mode */}
            {!isCloud && (
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateTodo();
                    setIsChecked(!isChecked);
                  }}
                  className="appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:border-none checked:bg-blue-500 transition-colors duration-200"
                />
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
            )}

            {/* Text - Now acts as the dialog trigger */}
            <DialogTrigger asChild>
              <div className="flex-1 hover:underline cursor-pointer">
                {!isCloud ? (
                  <motion.h1
                    className={`transition-opacity text-lg md:text-xl space-x-3 line-clamp-2 text-start ${
                      isChecked
                        ? "opacity-50 text-gray-400"
                        : "text-black dark:text-white"
                    }`}
                    transition={{ duration: 0.3 }}
                  >
                    {capitalizeFirstLetterOfTheString(todo.body)}
                    {isChecked && (
                      <motion.div
                        className="absolute left-0 top-1/2 h-0.5 bg-gray-400 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </motion.h1>
                ) : (
                  <div className="text-lg md:text-2xl space-x-3">
                    {capitalizeFirstLetterOfTheString(todo.body)}
                  </div>
                )}
              </div>
            </DialogTrigger>
          </div>

          {/* Right side - Status indicators */}
          {!isCloud ? (
            <TodoState state={isChecked} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-green-400 px-4 py-1 rounded-full uppercase">
                Completed
              </div>
              <DeleteButton todo={todo} />
            </div>
          )}
        </div>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Your Task</DialogTitle>
          <DialogDescription>
            Need to adjust something? Modify the details and we'll save it for
            you.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditTodo todo={todo} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoItem;

const TodoState = ({ state }: { state: boolean }) => {
  return state ? (
    <div className="bg-green-400 px-4 py-1 rounded-full uppercase">
      Completed
    </div>
  ) : (
    <div className="bg-yellow-300 px-4 py-1 rounded-full uppercase text-black">
      In progress
    </div>
  );
};
