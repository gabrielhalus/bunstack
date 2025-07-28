import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { auth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/_dashboard/users")({
  beforeLoad: async () => {
    const authResult = await auth();
    if (!(authResult.can("user:list") || authResult.isAdmin)) {
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
