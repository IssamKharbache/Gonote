import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "../loaders/LoadingButton";
import { Input } from "../ui/input";
import { Todo } from "./TodoList";
import { updateTodoContent } from "@/actions/todo/actions";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import InputCharacterLimits from "./InputCharacterLimits";
import { Button } from "../ui/button";
import { useUpdateTodoDialogStore } from "@/zustand/store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const EditTodo = ({ todo }: { todo: Todo }) => {
  const [todoContent, setTodoContent] = useState<string>(todo.body || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );

  const queryClient = useQueryClient();
  const { setIsOpen } = useUpdateTodoDialogStore();
  const charactersLimits = 200;

  const { mutate: updateTodoBody, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (todoContent.trim() === "") {
        return;
      }
      if (
        todoContent === todo.body &&
        dueDate?.toISOString() === new Date(todo.dueDate || "").toISOString()
      ) {
        return; // no changes
      }

      await updateTodoContent(todo._id, {
        body: todoContent,
        dueDate: dueDate,
      });
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
    <div className="flex flex-col gap-4">
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

      {/* Enhanced Date Picker */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Due Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? (
                format(dueDate, "PPP") // e.g. "May 10, 2023"
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              disabled={(date) => date < new Date()}
              modifiers={{
                today: new Date(),
              }}
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground hover:bg-primary",
                today: "border border-primary",
              }}
            />
            <div className="p-3 border-t flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDueDate(undefined)}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDueDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDueDate(tomorrow);
                }}
              >
                Tomorrow
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end items-end gap-4 pt-2">
        <Button onClick={() => setIsOpen(false)} variant="outline">
          Cancel
        </Button>
        <LoadingButton
          onClick={() => updateTodoBody()}
          isLoading={isUpdating}
          className="max-w-24"
        >
          Done
        </LoadingButton>
      </div>
    </div>
  );
};

export default EditTodo;
