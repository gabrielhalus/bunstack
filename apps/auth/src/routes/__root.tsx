import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { auth } from "@/lib/auth";

export const Route = createRootRouteWithContext()({
  component: RootLayout,
  beforeLoad: async () => {
    await auth({ redirectOnAuthenticated: true });
  },
});

function RootLayout() {
  return <Outlet />;
}
