import { Plus } from "lucide-react";
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { createTodoAction } from "@/actions/todo/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import { Link } from "@tanstack/react-router";

const TodoForm = () => {
  //states
  const [newTodo, setNewTodo] = useState<string>("");
  //hooks
  const queryCLient = useQueryClient();

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      await createTodoAction(newTodo);
    },
    mutationKey: ["createTodo"],
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodo("");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message,
      });
    },
  });

  return (
    <form
      onSubmit={createTodo}
      className="max-w-xl mx-auto mt-12 lg:mt-0 p-8 lg:p-0"
    >
      <div className="flex  items-center justify-between  mb-4 text-center bg-blue-100/40 rounded-full p-2">
        <span className="text-muted-foreground dark:text-white  text-center m-2 text-xs md:text-base">
          Your completed tasks and notes are saved in the cloud and will be
          deleted after 10 days
        </span>
        <Link
          to="/cloud"
          className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 duration-200 rounded-full p-2 text-xs md:text-base"
        >
          Check them
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="text-4xl"
              placeholder="Add a task or note to remember..."
            />
            <div>
              {isCreating ? (
                <button className="flex items-center justify-center w-10 h-10 rounded-lg  bg-blue-300 opacity-70  cursor-pointer duration-300  pointer-events-none ">
                  <CgSpinner size={20} className="text-white animate-spin" />
                </button>
              ) : (
                <button className="flex items-center justify-center w-10 h-10 rounded-lg  bg-blue-300 hover:bg-blue-400  dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer duration-300 ">
                  <Plus size={20} className="text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
