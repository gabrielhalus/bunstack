import type { Session } from "@bunstack/shared/types/auth";
import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
import { AuthProvider } from "@bunstack/react/providers/auth-provider";

export type RouterContext = {
  queryClient: QueryClient;
  session: Session | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  beforeLoad: async ({ location }) => {
    // Auth routes that should redirect if authenticated
    const isAuthRoute = location.pathname === "/" || 
      location.pathname.startsWith("/register") || 
      location.pathname.startsWith("/verify");
    
    if (isAuthRoute) {
      // For auth routes: redirect if authenticated, allow if unauthenticated
      await auth({ 
        redirectOnAuthenticated: true,
        redirectOnUnauthenticated: false 
      });
      return { session: null };
    }
    
    // For dashboard routes: require authentication
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
