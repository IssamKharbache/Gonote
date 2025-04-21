import RegisterForm from "@/components/forms/RegisterForm";
import RoutePendingLoader from "@/components/loaders/RoutePendingLoader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
  pendingComponent: () => <RoutePendingLoader />,
});

function RouteComponent() {
  return <RegisterForm />;
}
