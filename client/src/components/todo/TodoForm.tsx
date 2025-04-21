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
  const [isValidated, setValidated] = useState<boolean>(true);
  //hooks
  const queryCLient = useQueryClient();

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (newTodo === "") {
        setValidated(false);
        return null;
      }
      await createTodoAction(newTodo);
    },
    mutationKey: ["createTodo"],
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodo("");
    },
    onError: (error) => {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Check your internet connection and try again !",
      });
    },
  });

  return (
    <>
      <div className="text-center bg-blue-100/60  dark:bg-blue-900 w-full  md:max-w-2xl mx-auto md:rounded-full p-1.5 md:mt-4">
        <span className="text-muted-foreground dark:text-white   m-2 text-sm md:text-lg text-center">
          Your completed tasks and notes are saved in
          <Link
            to="/cloud"
            className="underline text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-500 duration-200"
          >
            {" "}
            your cloud
          </Link>{" "}
          and will be deleted after 10 days
        </span>
      </div>
      <form
        onSubmit={createTodo}
        className="max-w-2xl mx-auto mt-12 lg:mt-0 p-8 lg:p-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-full">
            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => {
                  setNewTodo(e.target.value);
                  if (e.target.value.length > 0) {
                    setValidated(true);
                  } else {
                    setValidated(false);
                  }
                }}
                className="text-lg"
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
        {!isValidated ? (
          <p className="ml-2 mt-2 text-red-500 dark:text-red-400">
            You have to add a task or note first
          </p>
        ) : null}
      </form>
    </>
  );
};

export default TodoForm;
