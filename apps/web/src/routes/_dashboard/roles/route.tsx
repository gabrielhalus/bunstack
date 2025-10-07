import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "@/lib/auth";

export const Route = createFileRoute("/_dashboard/roles")({
  beforeLoad: async () => {
    const { can } = await auth();
    if (!can("role:list")) {
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
