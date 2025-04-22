import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "@/components/navbar/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: () => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    return {
      queryClient,
      userId,
    };
  },
});

function RootComponent() {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        {/* outlet or all routes will be rendered here */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
