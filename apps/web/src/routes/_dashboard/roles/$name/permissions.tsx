import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_dashboard/roles/$name/permissions",
)({
  loader: () => ({ crumb: "Permissions" }),
  component: RolePermissions,
});

function RolePermissions() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Role Permissions</h1>
        <p className="text-muted-foreground">Manage the permissions assigned to this role here.</p>
      </div>
    </div>
  );
}
