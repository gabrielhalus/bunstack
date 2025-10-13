import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext()({
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}
