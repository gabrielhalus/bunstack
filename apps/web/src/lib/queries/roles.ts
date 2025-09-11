import { queryOptions } from "@tanstack/react-query";

import { getAllRoles, getRoleByName, getRolesPaginated } from "@/lib/api/roles";

export const getAllRolesQueryOptions = queryOptions({
  queryKey: ["get-all-roles"],
  queryFn: getAllRoles,
  staleTime: 1000 * 60 * 5,
});

export const getRolesPaginatedQueryOptions = ({ page, pageSize }: { page?: number; pageSize?: number }) =>
  queryOptions({
    queryKey: ["get-roles-paginated", page, pageSize],
    queryFn: () => getRolesPaginated({ page, pageSize }),
    staleTime: 1000 * 60 * 5,
  });

export const getRoleByNameQueryOptions = (name: string) =>
  queryOptions({
    queryKey: ["get-role-by-name", name],
    queryFn: () => getRoleByName(name),
    staleTime: 1000 * 60 * 5,
  });
