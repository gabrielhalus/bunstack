import type { Session } from "@bunstack/shared/types/auth";
import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
import { AuthProvider } from "@/providers/auth-provider";

export type RouterContext = {
  queryClient: QueryClient;
  session: Session;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  beforeLoad: async () => {
    const session = await auth();
    return { session };
  },
});

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
