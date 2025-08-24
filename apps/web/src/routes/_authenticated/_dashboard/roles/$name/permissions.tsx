import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/roles/$name/permissions",
)({
  loader: () => ({ crumb: "Permissions" }),
  component: RolePermissions,
});

function RolePermissions() {
  const { name } = Route.useParams();

  return (
    <div>
      Hello "/_authenticated/_dashboard/roles/
      {name}
      /permissions"!
    </div>
  );
}
