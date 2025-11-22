import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/settings/users")({
  component: UsersLayout,
  beforeLoad: async ({ context: { session: { can } } }) => {
    if (!can("user:list")) {
      throw redirect({ to: "/" });
    }
  },
  loader: () => ({
    crumb: "pages.users.title",
  }),
});

function UsersLayout() {
  return <Outlet />;
}
