import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getRoleByNameQueryOptions } from "@/lib/queries/roles";

export const Route = createFileRoute("/_authenticated/_dashboard/roles/$name/")({
  component: RoleDetails,
});

function RoleDetails() {
  const { name } = Route.useParams();

  const { data: role, isLoading, isError } = useQuery(getRoleByNameQueryOptions(name));

  if (isLoading)
    return <div>Loading...</div>;
  if (isError)
    return <div>Error loading role</div>;

  return (
    <div>
      <h1>
        Role:
        {role?.name}
      </h1>
      <p>
        ID:
        {role?.id}
      </p>
      {/* Add more fields here */}
    </div>
  );
}
