import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/roles")({
  beforeLoad: async ({ context: { session: { can } } }) => {
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
