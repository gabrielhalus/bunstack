import type { RoleWithMembers, RoleWithMembersCount } from "@bunstack/shared/db/types/roles";

import { queryOptions } from "@tanstack/react-query";

import { getAllRoles, getRoleByName } from "@/lib/api/roles";

export const getAllRolesQueryOptions = queryOptions<RoleWithMembersCount[]>({
  queryKey: ["get-all-roles"],
  queryFn: getAllRoles,
  staleTime: 1000 * 60 * 5,
});

export const getRoleByNameQueryOptions = (name: string) =>
  queryOptions<RoleWithMembers>({
    queryKey: ["get-role-by-name", name],
    queryFn: () => getRoleByName(name),
    staleTime: 1000 * 60 * 5,
  });
