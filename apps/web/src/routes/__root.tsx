import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { AuthProvider } from "@/providers/auth-provider";

export type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    try {
      await auth();
    } catch {
      throw redirect({
        href: `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(window.location.href)}`,
        replace: true,
      });
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
