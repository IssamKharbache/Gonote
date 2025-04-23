import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/actions/todo/actions";
import { CgSpinner } from "react-icons/cg";
import TodoItem from "./TodoItem";
import EmptyTodoList from "../homeUi/EmptyTodoList";
import Swal from "sweetalert2";
import { useAuthStore } from "@/zustand/store";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import DeleteButton from "../buttons/DeleteButton";

export type Todo = {
  _id: string;
  body: string;
  completed: boolean;
  userId: string;
};

const TodoList = () => {
  const { user } = useAuthStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
      if (lastPage.length < 5) return undefined; // stop when no more todos
      return allPages.length + 1;
    },
    enabled: !!user?.id,
  });

  const todos = data?.pages.flat() || [];
  const filteredTodos = todos.filter((todo) => !todo.completed);

  // Infinite scroll observer
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

  console.log(hasNextPage);

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

  return (
    <section className="max-w-2xl mx-auto">
      <div className="mr-5">
        {filteredTodos.map((todo) => (
          <div className="flex items-center gap-2" key={todo._id}>
            <TodoItem todo={todo} />
            <DeleteButton todo={todo} />
          </div>
        ))}
      </div>
      <div ref={loadMoreRef} className="mt-4 mb-4 ">
        {isFetchingNextPage &&
          !isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-7 bg-slate-100 duration-300 w-full m-2 animate-pulse dark:bg-slate-900"
            />
          ))}
      </div>{" "}
    </section>
  );
};

export default TodoList;
