import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/roles/$name/members",
)({
  component: RoleMembers,
});

function RoleMembers() {
  const { name } = Route.useParams();

  return (
    <div>
      Hello "/_authenticated/_dashboard/roles/
      {name}
      /members"!
    </div>
  );
}
