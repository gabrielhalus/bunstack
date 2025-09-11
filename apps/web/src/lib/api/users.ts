import type { User, UserWithRoles } from "@bunstack/shared/db/types/users";

import { fetchAuthenticated } from "@/lib/api/http";

export async function getAllUsers(): Promise<{ users: UserWithRoles[]; total: number }> {
  const res = await fetchAuthenticated("/api/users");

  if (!res.ok) {
    throw new Error("Failed to get users");
  }

  return await res.json();
}

export async function getUsersPaginated({ page = 0, pageSize = 10 }: { page?: number; pageSize?: number }): Promise<{ users: UserWithRoles[]; total: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

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
