import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/actions/todo/actions";
import { CgSpinner } from "react-icons/cg";
import TodoItem from "./TodoItem";
import EmptyTodoList from "../homeUi/EmptyTodoList";
import Swal from "sweetalert2";
import { useAuthStore } from "@/zustand/store";
import { useEffect, useRef, useState } from "react";
import DeleteButton from "../buttons/DeleteButton";
import { IoIosArrowDown } from "react-icons/io";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import EditTodo from "./EditTodo";
import { useUpdateTodoDialogStore } from "@/zustand/store";

export type Todo = {
  _id: string;
  body: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
};

const TodoList = () => {
  const { user } = useAuthStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isTodayOpen, setIsTodayOpen] = useState(true);
  const { isOpen, setIsOpen } = useUpdateTodoDialogStore();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [dueOption, setDueOption] = useState<"today" | "tomorrow" | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["todos", user?.id],
    queryFn: ({ pageParam = 1 }) =>
      fetchTodos({ pageParam, userId: user?.id! }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 5) return undefined;
      return allPages.length + 1;
    },
    enabled: !!user?.id,
  });

  const handleSetDueDate = (todo: Todo, daysToAdd: number) => {
    const dueDate = addDays(new Date(), daysToAdd);
    // Here you would call your API to update the todo with the dueDate
    console.log(`Setting due date for ${todo.body} to ${dueDate}`);
    // After setting, you might want to invalidate the query to refresh
  };

  const todos = data?.pages.flat() || [];
  const filteredTodos = todos.filter((todo) => !todo.completed);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto mt-24">
        <div className="flex items-center justify-center">
          <CgSpinner
            size={60}
            className="animate-spin text-blue-400 dark:text-blue-600"
          />
        </div>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return <EmptyTodoList text="You don't have any tasks" />;
  }

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text:
        (error as Error).message ||
        "Check your internet connection and try again!",
    });
  }

  const todayTodos = filteredTodos.filter((todo) => {
    const todoDate = new Date(todo.createdAt);
    const today = new Date();
    return (
      todoDate.getDate() === today.getDate() &&
      todoDate.getMonth() === today.getMonth() &&
      todoDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <section className="max-w-2xl mx-auto">
      {/* Collapsible Today Section */}
      <Collapsible
        open={isTodayOpen}
        onOpenChange={setIsTodayOpen}
        className="space-y-2"
      >
        <div className="flex items-center justify-between px-4">
          <CollapsibleTrigger className="flex gap-4 items-center">
            <IoIosArrowDown
              className={`transition-transform ${
                isTodayOpen ? "rotate-180" : ""
              }`}
            />
            <p className="font-medium">
              Today{" "}
              <span className="text-muted-foreground">{todayTodos.length}</span>
            </p>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-2">
          <div className="mr-5">
            {todayTodos.map((todo) => (
              <div className="flex items-center gap-2" key={todo._id}>
                <TodoItem todo={todo} />

                {/* Edit Dialog Trigger */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTodo(todo)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                      <DialogDescription>
                        Make changes to your task here.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Original Edit Form */}
                    <EditTodo todo={todo} />

                    {/* Due Date Quick Options */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Set Due Date:</p>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            dueOption === "today" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setDueOption("today");
                            handleSetDueDate(todo, 0);
                          }}
                        >
                          Today
                        </Button>
                        <Button
                          variant={
                            dueOption === "tomorrow" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setDueOption("tomorrow");
                            handleSetDueDate(todo, 1);
                          }}
                        >
                          Tomorrow
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <DeleteButton todo={todo} />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Infinite scroll loader */}
      <div ref={loadMoreRef} className="mt-4 mb-4">
        {isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-7 bg-slate-100 duration-300 w-full m-2 animate-pulse dark:bg-slate-900"
            />
          ))}
      </div>
    </section>
  );
};

export default TodoList;
