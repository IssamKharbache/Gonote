import RegisterForm from "@/components/forms/RegisterForm";
import RoutePendingLoader from "@/components/loaders/RoutePendingLoader";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
  pendingComponent: () => <RoutePendingLoader />,
  loader: () => {
    const isAuth = !!localStorage.getItem("token");
    if (isAuth) {
      return redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return <RegisterForm />;
}
