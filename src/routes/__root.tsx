import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Header } from "../components/Header/Header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <div className="min-h-screen pt-16 bg-black">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
