import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "@/components/navbar/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const client = new QueryClient();

  return (
    <React.Fragment>
      <QueryClientProvider client={client}>
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
