import LoginForm from "@/components/forms/LoginForm";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
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
  return <LoginForm />;
}
