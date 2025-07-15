import { queryOptions } from "@tanstack/react-query";

import { getAllUsers } from "@/lib/api/users";

export const getAllUsersQueryOptions = queryOptions({
  queryKey: ["get-all-users"],
  queryFn: getAllUsers,
  staleTime: 1000 * 60 * 5,
});
