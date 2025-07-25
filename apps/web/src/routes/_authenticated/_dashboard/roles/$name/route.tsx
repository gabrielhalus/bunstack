import { createFileRoute, Outlet } from "@tanstack/react-router";

import { getRoleByNameQueryOptions } from "@/lib/queries/roles";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/roles/$name",
)({
  component: RoleLayout,
  loader: async ({ params, context }) => {
    const queryClient = context.queryClient;
    const role = await queryClient.ensureQueryData(getRoleByNameQueryOptions(params.name));

    return {
      crumb: role.label,
    };
  },
});

function RoleLayout() {
  return <Outlet />;
}
