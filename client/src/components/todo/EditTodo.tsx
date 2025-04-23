import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "../loaders/LoadingButton";
import { Input } from "../ui/input";
import { Todo } from "./TodoList";
import { updateTodoContent } from "@/actions/todo/actions";
import { useState } from "react";
import Swal from "sweetalert2";
import InputCharacterLimits from "./InputCharacterLimits";
import { Button } from "../ui/button";
import { useUpdateTodoDialogStore } from "@/zustand/store";

const EditTodo = ({ todo }: { todo: Todo }) => {
  const [todoContent, setTodoContent] = useState<string>(todo.body || "");

  const queryClient = useQueryClient();

  const charactersLimits = 200;

  //store
  const { setIsOpen } = useUpdateTodoDialogStore();

  const { mutate: updateTodoBody, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (todoContent === "") {
        return;
      }
      if (todoContent === todo.body) {
        return;
      }

      await updateTodoContent(todo._id, todoContent);
    },
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["todos", todo.userId] });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message || "Please check your internet and try again",
      });
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Add a task or note to remember..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateTodoBody();
          }
        }}
        value={todoContent}
        className="w-full"
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.trim().length > charactersLimits) {
            e.preventDefault();
            return;
          } else {
            setTodoContent(newValue);
          }
        }}
      />

      <p className="text-red-500 dark:text-red-400 ml-3">
        {todoContent.length === 0
          ? "This field is required"
          : todoContent.length >= charactersLimits &&
            `You have reached the limit of ${charactersLimits} characters`}
      </p>

      <InputCharacterLimits todoContent={todoContent} />
      <div className="flex justify-end items-end gap-4">
        <Button onClick={() => setIsOpen(false)} variant="outline">
          Cancel
        </Button>
        <LoadingButton
          onClick={() => updateTodoBody()}
          isLoading={isUpdating}
          className="max-w-24 "
        >
          Done
        </LoadingButton>
      </div>
    </div>
  );
};

export default EditTodo;
