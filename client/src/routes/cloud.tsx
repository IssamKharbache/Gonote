import RoutePendingLoader from "@/components/loaders/RoutePendingLoader";

import { createFileRoute } from "@tanstack/react-router";

import CompletedTodos from "@/components/todo/CompletedTodos";

export const Route = createFileRoute("/cloud")({
  component: RouteComponent,
  pendingComponent: () => <RoutePendingLoader />,
});

function RouteComponent() {
  return <CompletedTodos />;
}
