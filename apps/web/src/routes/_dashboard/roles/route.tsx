import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_dashboard/roles")({
  beforeLoad: async () => {
    const authResult = await auth();
    if (!(authResult.can("role:list") || authResult.isAdmin)) {
      throw redirect({ to: "/" });
    }
  },
  component: RolesLayout,
  loader: () => ({
    crumb: "pages.roles.title",
  }),
});

function RolesLayout() {
  return <Outlet />;
}
