import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "@/hooks/use-auth";
import { getRoleByNameQueryOptions } from "@/lib/queries/roles";

export const Route = createFileRoute("/_authenticated/_dashboard/roles/$name")({
  beforeLoad: async ({ params, context }) => {
    const { queryClient } = context;
    const authResult = await auth();

    let role;
    try {
      role = await queryClient.ensureQueryData(getRoleByNameQueryOptions(params.name));
    } catch {
      throw redirect({ to: "/" });
    }

    if (!authResult.can("role:read", role) && !authResult.isAdmin) {
      throw redirect({ to: "/" });
    }
  },

  loader: async ({ params, context }) => {
    const { queryClient } = context;

    const role = await queryClient.ensureQueryData(getRoleByNameQueryOptions(params.name));
    return { crumb: role.label };
  },
  component: RoleLayout,
});

function RoleLayout() {
  return <Outlet />;
}
