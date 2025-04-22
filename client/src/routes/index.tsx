import { deleteTodosOlderThanTenDays } from "@/cron/cron";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main>
      <button className="" onClick={deleteTodosOlderThanTenDays}>
        FETCH TODOS
      </button>
    </main>
  );
}
