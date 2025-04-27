import { forwardRef, useState } from "react";
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
import { useEditTodoStore, useUpdateTodoDialogStore } from "@/zustand/store";

const MotionTrigger = forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
  <button
    ref={ref}
    className="flex-1 hover:underline cursor-pointer text-left p-0 border-none bg-transparent"
  >
    {children}
  </button>
));
MotionTrigger.displayName = "MotionTrigger";

const TodoItem = ({ todo, isCloud }: { todo: Todo; isCloud?: boolean }) => {
  const { selectedTodo, setSelectedTodo } = useEditTodoStore();
  const [isChecked, setIsChecked] = useState(todo?.completed || false);
  const queryClient = useQueryClient();
  const { isOpen, setIsOpen } = useUpdateTodoDialogStore();

  const { mutate: updateTodo } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => await updateTodoAction(todo?._id || ""),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData(["todos"]);
      setIsChecked((prev) => !prev);
      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", todo?.userId],
      });
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", todo?.userId],
      });
    },
  });

  const handleOpenChange = () => {
    setSelectedTodo(todo);
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    updateTodo();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div className="border rounded-2xl p-4 hover:bg-slate-100 dark:hover:bg-slate-800 duration-300 w-full m-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left side - Checkbox and Text */}
          <div className="flex items-center gap-5 flex-1">
            {!isCloud && (
              <motion.div
                className="relative flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  onClick={(e) => e.stopPropagation()}
                  className="appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:border-none checked:bg-blue-500 transition-colors duration-200"
                />
                {isChecked && (
                  <motion.svg
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
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
              </motion.div>
            )}

            <DialogTrigger asChild>
              <MotionTrigger>
                <div className="relative">
                  {!isCloud ? (
                    <motion.div className="relative" layout>
                      <motion.span
                        className={`block text-lg md:text-xl space-x-3 line-clamp-2 text-start ${
                          isChecked
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-black dark:text-white"
                        }`}
                        initial={false}
                        animate={{
                          opacity: isChecked ? 0.6 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {capitalizeFirstLetterOfTheString(todo?.body)}
                      </motion.span>
                      {isChecked && (
                        <motion.div
                          className="absolute left-0 top-1/2 h-0.5 bg-gray-400"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{
                            width: "100%",
                            originX: 0,
                            y: "-50%",
                          }}
                        />
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-lg md:text-2xl space-x-3">
                      {capitalizeFirstLetterOfTheString(todo.body || "")}
                    </div>
                  )}
                </div>
              </MotionTrigger>
            </DialogTrigger>
          </div>

          {/* Right side - Status indicators */}
          {!isCloud ? (
            <>
              <p className="text-muted-foreground">
                {formatTime(todo?.createdAt || "")}
              </p>
              <TodoState state={isChecked} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                {formatTime(todo?.createdAt || "")}
              </p>
              <div className="bg-green-400 px-4 py-1 rounded-full uppercase">
                Done
              </div>
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
          <EditTodo todo={selectedTodo} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoItem;

const TodoState = ({ state }: { state: boolean }) => {
  return state ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-green-400 px-4 py-1 rounded-full uppercase"
    >
      Done
    </motion.div>
  ) : (
    <motion.div
      className="bg-yellow-300 w-6 h-6 rounded-full uppercase text-black"
      whileHover={{ scale: 1.1 }}
    />
  );
};

function formatTime(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
