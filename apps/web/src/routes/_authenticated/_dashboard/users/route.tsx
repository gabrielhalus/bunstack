import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/_dashboard/users")({
  beforeLoad: async () => {
    const { can } = await auth();
    if (!can("list:users")) {
      throw redirect({ to: "/" });
    }
  },
  component: UsersLayout,
  loader: () => ({
    crumb: "Users",
  }),
});

function UsersLayout() {
  return <Outlet />;
}
