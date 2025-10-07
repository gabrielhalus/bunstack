import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_dashboard/roles/$name/permissions/",
)({
  loader: () => ({ crumb: "pages.roles.detail.pages.permissions.title" }),
  component: RolePermissions,
});

function RolePermissions() {
  return (
    <div className="space-y-4">
      <div>
      </div>
    </div>
  );
}
