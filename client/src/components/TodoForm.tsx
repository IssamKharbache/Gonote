import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { createTodoAction, fetchTodos } from "@/actions/todo/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const TodoForm = () => {
  //states
  const [newTodo, setNewTodo] = useState<string>("");
  const queryCLient = useQueryClient();

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      createTodoAction(newTodo);
    },
    mutationKey: ["createTodo"],
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: any) => {
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
      <div className="flex items-center gap-3">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a task or note to remember..."
            />
            <div>
              {isCreating ? (
                <button className="flex items-center justify-center w-10 h-10 rounded-lg  bg-blue-300 opacity-70  cursor-pointer duration-300  pointer-events-none ">
                  <CgSpinner size={20} className="text-white animate-spin" />
                </button>
              ) : (
                <button className="flex items-center justify-center w-10 h-10 rounded-lg  bg-blue-300 hover:bg-blue-400  cursor-pointer duration-300 ">
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
