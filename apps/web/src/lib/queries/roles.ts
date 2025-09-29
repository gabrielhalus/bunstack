import { queryOptions } from "@tanstack/react-query";

import type { PaginationInput } from "@bunstack/shared/contracts/pagination";

import { getAllRoles, getRoleByName, getRolesPaginated } from "@/lib/api/roles";

export const getAllRolesQueryOptions = queryOptions({
  queryKey: ["get-all-roles"],
  queryFn: getAllRoles,
  staleTime: 1000 * 60 * 5,
});

export function getRolesPaginatedQueryOptions({ page, pageSize, sortField, sortDirection, search }: PaginationInput) {
  return queryOptions({
    queryKey: ["get-roles-paginated", page, pageSize, sortField, sortDirection, search],
    queryFn: () => getRolesPaginated({ page, pageSize, sortField, sortDirection, search }),
    staleTime: 1000 * 60 * 5,
  });
}

export function getRoleByNameQueryOptions(name: string) {
  return queryOptions({
    queryKey: ["get-role-by-name", name],
    queryFn: () => getRoleByName(name),
    staleTime: 1000 * 60 * 5,
  });
}
