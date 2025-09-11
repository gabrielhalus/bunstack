import type { User, UserWithRoles } from "@bunstack/shared/db/types/users";

import { fetchAuthenticated } from "@/lib/api/http";

export async function getAllUsers(): Promise<{ users: UserWithRoles[]; total: number }> {
  const res = await fetchAuthenticated("/api/users");

  if (!res.ok) {
    throw new Error("Failed to get users");
  }

  return await res.json();
}

export async function getUsersPaginated({ page = 0, pageSize = 10, search, sortField, sortDirection }: { page?: number; pageSize?: number; search?: string; sortField?: string; sortDirection?: "asc" | "desc" }): Promise<{ users: UserWithRoles[]; total: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) {
    params.append("search", search);
  }
  if (sortField) {
    params.append("sortField", sortField);
  }
  if (sortDirection) {
    params.append("sortDirection", sortDirection);
  }

  const res = await fetchAuthenticated(`/api/users?${params}`);
  if (!res.ok) {
    throw new Error("Failed to get users");
  }

  return await res.json();
}

export async function deleteUser({ id }: { id: string }): Promise<{ user: User }> {
  const res = await fetchAuthenticated(`/api/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return await res.json();
}
