import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: RouteComponent,
  pendingComponent: () => <div className="text-5xl">Loading ....</div>,
});

function RouteComponent() {
  return <div>Hello "/about"!</div>;
}
