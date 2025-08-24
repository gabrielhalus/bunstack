import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/roles/$name/members",
)({
  loader: () => ({ crumb: "Members" }),
  component: RoleMembers,
});

function RoleMembers() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Role Members</h1>
        <p className="text-muted-foreground">Manage the members assigned to this role here.</p>
      </div>
    </div>
  );
}
