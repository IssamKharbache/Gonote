import RegisterForm from "@/components/forms/RegisterForm";
import RoutePendingLoader from "@/components/loaders/RoutePendingLoader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  },
  pendingComponent: () => <RoutePendingLoader />,
});

function RouteComponent() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
