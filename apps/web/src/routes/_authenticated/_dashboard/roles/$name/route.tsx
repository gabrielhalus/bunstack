import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getRoleByNameQueryOptions } from "@/lib/queries/roles";
import { auth } from "@/hooks/use-auth";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/roles/$name",
)({
  beforeLoad: async ({ params, context }) => {
    const queryClient = context.queryClient;

    
    const authResult = await auth();
    const role = await queryClient.ensureQueryData(getRoleByNameQueryOptions(params.name));
    
    if (!(authResult.can("role:read", role) || authResult.isAdmin)) {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ params, context }) => {
    const queryClient = context.queryClient;
    const role = await queryClient.ensureQueryData(getRoleByNameQueryOptions(params.name));
    
    return {
      crumb: role.label,
    };
  },
  component: RoleLayout,
});

function RoleLayout() {
  return <Outlet />;
}
