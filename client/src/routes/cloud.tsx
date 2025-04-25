import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/actions/todo/actions";
import EmptyTodoList from "@/components/homeUi/EmptyTodoList";
import RoutePendingLoader from "@/components/loaders/RoutePendingLoader";
import TodoItem from "@/components/todo/TodoItem";
import { Todo } from "@/components/todo/TodoList";
import { useAuthStore } from "@/zustand/store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { CgSpinner } from "react-icons/cg";

export const Route = createFileRoute("/cloud")({
  component: RouteComponent,
  pendingComponent: () => <RoutePendingLoader />,
});

function RouteComponent() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["todos", user?.id, "completed"],
    queryFn: ({ pageParam = 1 }) =>
      fetchTodos({ pageParam, userId: user?.id! }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 5 ? undefined : allPages.length + 1,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  // **Filter completed todos across all pages after fetching**
  const completedTodos =
    data?.pages.flat().filter((todo) => todo.completed) || [];

  // **Infinite scroll observer**
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

  if (!isAuthenticated) return null;

  if (status === "pending") {
    return <RoutePendingLoader />;
  }

  if (completedTodos.length === 0) {
    return <EmptyTodoList text="You don't have any completed tasks" />;
  }

  return (
    <section className="max-w-xl mx-auto mt-12">
      <h1 className=" text-3xl text-center bg-blue-200 dark:bg-blue-950 rounded  p-3 m-10">
        Completed Tasks
      </h1>
      {completedTodos.map((todo) => (
        <div key={todo._id} className="m-3">
          <TodoItem todo={todo} isCloud={true} />
        </div>
      ))}

      {/* Scroll Triggered Load More Button */}
      <div ref={loadMoreRef} className="mt-4 mb-4">
        {isFetchingNextPage &&
          !isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-7 bg-slate-100 duration-300 w-full m-2 animate-pulse dark:bg-slate-900"
            />
          ))}
      </div>
    </section>
  );
}
