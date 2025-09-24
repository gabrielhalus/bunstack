import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";

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
      throw redirect({ href: `http://localhost:4001/login?redirect=${encodeURIComponent(location.href)}` });
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}
