import { queryOptions } from "@tanstack/react-query";

import { getAllUsers, getUsersPaginated } from "@/lib/api/users";

export const getAllUsersQueryOptions = queryOptions({
  queryKey: ["get-all-users"],
  queryFn: getAllUsers,
  staleTime: 1000 * 60 * 5,
});

export const getUsersPaginatedQueryOptions = ({ page, pageSize, search, sortField, sortDirection }: { page?: number; pageSize?: number; search?: string; sortField?: string; sortDirection?: "asc" | "desc" }) => queryOptions({
  queryKey: ["get-users-paginated", page, pageSize, search, sortField, sortDirection],
  queryFn: () => getUsersPaginated({ page, pageSize, search, sortField, sortDirection }),
  staleTime: 1000 * 60 * 5,
});
