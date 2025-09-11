import { queryOptions } from "@tanstack/react-query";

import { getAllUsers, getUsersPaginated } from "@/lib/api/users";

export const getAllUsersQueryOptions = queryOptions({
  queryKey: ["get-all-users"],
  queryFn: getAllUsers,
  staleTime: 1000 * 60 * 5,
});

export const getUsersPaginatedQueryOptions = ({ page, pageSize }: { page?: number; pageSize?: number }) => queryOptions({
  queryKey: ["get-users-paginated", page, pageSize],
  queryFn: () => getUsersPaginated({ page, pageSize }),
  staleTime: 1000 * 60 * 5,
});
