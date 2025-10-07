import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("web");
  const { role } = Route.useLoaderData();

  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="w-full max-w-3xl m-4 space-y-8">
        <h1>{t("pages.roles.detail.title", { role: role.label })}</h1>
        <Nav />
        <Outlet />
      </div>
    </div>
  );
}
