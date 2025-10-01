import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Nav } from "./-components/nav";
import { Sidebar } from "./-components/sidebar";
import { auth } from "@/hooks/use-auth";
import { getRoleByNameQueryOptions } from "@/lib/queries/roles";

export const Route = createFileRoute("/_dashboard/roles/$name")({
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

    const { role } = await queryClient.ensureQueryData(getRoleByNameQueryOptions(params.name));
    return { role, crumb: role.label };
  },
  component: RoleLayout,
});

function RoleLayout() {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="w-full max-w-3xl mx-4">
        <Nav />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
