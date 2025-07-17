import { can } from "@bunstack/shared/access";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/queries/auth";

export const Route = createFileRoute("/_authenticated/_dashboard/roles")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const { user } = await queryClient.ensureQueryData(userQueryOptions);

    if (!can(user, "roles", "view")) {
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
