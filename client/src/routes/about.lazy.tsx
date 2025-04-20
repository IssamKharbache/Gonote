import RoutePendingLoader from "@/components/loaders/RoutePendingLoader";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: RouteComponent,
  pendingComponent: () => <RoutePendingLoader />,
});

function RouteComponent() {
  return <div>Hello "/about"!</div>;
}
