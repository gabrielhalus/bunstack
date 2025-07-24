import { queryOptions } from "@tanstack/react-query";

import { getAllRoles } from "@/lib/api/roles";

export const getAllRolesQueryOptions = queryOptions({
  queryKey: ["get-all-roles"],
  queryFn: getAllRoles,
  staleTime: 1000 * 60 * 5,
});
