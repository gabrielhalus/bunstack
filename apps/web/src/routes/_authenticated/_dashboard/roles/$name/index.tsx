import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getRoleByNameQueryOptions } from "@/lib/queries/roles";

import { Form } from "./-components/form";

export const Route = createFileRoute("/_authenticated/_dashboard/roles/$name/")({
  component: RoleDetails,
});

function RoleDetails() {
  const { name } = Route.useParams();

  const { data, isLoading, isError } = useQuery(getRoleByNameQueryOptions(name));

  if (isLoading)
    return <div>Loading...</div>;
  if (isError)
    return <div>Error loading role</div>;

  return (
    <div className="p-4">
      <Form role={data!} />
    </div>
  );
}
