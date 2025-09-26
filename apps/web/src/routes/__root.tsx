import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";

import { env } from "@/lib/env";
import { userQueryOptions } from "@/lib/queries/auth";

export type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;

    try {
      await queryClient.fetchQuery(userQueryOptions);
    } catch {
      throw redirect({ href: `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(location.href)}`, replace: true });
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}
