import type { PaginationInput } from "@bunstack/shared/contracts/pagination";

import { queryOptions } from "@tanstack/react-query";

import { fetchAllUsers, fetchUser, fetchUsersPaginated } from "@/lib/api/users";

export const getAllUsersQueryOptions = queryOptions({
  queryKey: ["get-all-users"],
  queryFn: fetchAllUsers,
  staleTime: 1000 * 60 * 5,
});

export function getUsersPaginatedQueryOptions({ page, pageSize, search, sortField, sortDirection }: PaginationInput) {
  return queryOptions({
    queryKey: ["get-users-paginated", page, pageSize, search, sortField, sortDirection],
    queryFn: () => fetchUsersPaginated({ page, pageSize, search, sortField, sortDirection }),
    staleTime: 1000 * 60 * 5,
  });
}

export function getUserQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["get-user", id],
    queryFn: () => fetchUser(id),
    staleTime: 1000 * 60 * 5,
  });
}
