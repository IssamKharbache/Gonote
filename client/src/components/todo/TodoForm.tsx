import { Plus } from "lucide-react";
import { TbTooltip } from "react-icons/tb";
import React, { useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { createTodoAction } from "@/actions/todo/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import { Link } from "@tanstack/react-router";
import { AuthenticatedUser } from "@/routes/todos/create";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TodoForm = ({ user }: { user: AuthenticatedUser }) => {
  //states
  const [newTodo, setNewTodo] = useState<string>("");
  const [isValidated, setValidated] = useState<boolean>(true);
  //hooks
  const queryCLient = useQueryClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();

      if (newTodo === "") {
        inputRef.current?.focus();
        setValidated(false);
        return null;
      }
      const allData = {
        userId: user.id,
        body: newTodo,
      };
      await createTodoAction(allData);
    },
    mutationKey: ["createTodo"],
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["todos", user.id] });
      setNewTodo("");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message || "Check your internet connection and try again !",
      });
    },
  });

  return (
    <>
      <div className="flex md:hidden items-center justify-center bg-blue-400 dark:bg-blue-700 text-center">
        <span className=" text-black dark:text-white   m-2 text-sm md:text-lg ">
          Your completed tasks and notes are saved in
          <Link
            to="/cloud"
            className="underline text-white dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 duration-200"
          >
            {" "}
            your cloud
          </Link>{" "}
          and will be deleted after 10 days
        </span>
      </div>
      <div className="mt-4 mb-4 max-w-2xl mx-auto flex   md:items-center md:justify-between p-5">
        <div className="">
          <h1 className="font-semibold text-3xl capitalize">
            Hey, {user.first_name}
          </h1>
          <p className="text-muted-foreground">
            Let’s bring your ideas to life — what do you want to accomplish
            today?
          </p>
        </div>

        <div className="hidden md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center justify-center border-5 border-blue-300 dark:border-blue-600 w-12 h-12 rounded-full animate-pulse">
                <TbTooltip
                  size={25}
                  className="text-blue-300 dark:text-blue-600"
                />
              </TooltipTrigger>
              <TooltipContent className=" bg-blue-100/60  dark:bg-blue-900  md:max-w-2xl mx-auto  lg:mb-5 p-1.5 md:mt-4 max-w-md">
                <span className="text-muted-foreground dark:text-white   m-2 text-sm md:text-lg ">
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <form
        onSubmit={createTodo}
        className="max-w-2xl mx-auto  lg:mt-0 p-3 lg:p-0 "
      >
        <div className="flex items-center gap-3">
          <div className="w-full">
            <div className="flex items-center gap-3 p-0 md:p-2">
              <Input
                ref={inputRef}
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
