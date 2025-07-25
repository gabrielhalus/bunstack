import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/_dashboard/roles")({
  beforeLoad: async () => {
    const authResult = await auth();
    if (!(authResult.can("manage:users") || authResult.isAdmin)) {
      throw redirect({ to: "/" });
    }
  },
  component: RolesLayout,
  loader: () => ({
    crumb: "Roles",
  }),
});

function RolesLayout() {
  return <Outlet />;
}
