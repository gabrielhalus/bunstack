import type { Role, RoleWithMembers, RoleWithMembersCount } from "@bunstack/shared/db/types/roles";

import { fetchAuthenticated } from "./http";

export async function getAllRoles(): Promise<{ roles: RoleWithMembersCount[]; total: number }> {
  const res = await fetchAuthenticated("/api/roles");

  if (!res.ok) {
    throw new Error("Failed to get roles");
  }

  return res.json();
}

export async function getRolesPaginated({
  page = 0,
  pageSize = 10,
  sortField,
  sortDirection,
  search,
}: {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
}): Promise<{ roles: RoleWithMembersCount[]; total: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  // Add sorting parameters if provided
  if (sortField) {
    params.append("sortField", sortField);
  }
  if (sortDirection) {
    params.append("sortDirection", sortDirection);
  }

  // Add search parameter if provided
  if (search) {
    params.append("search", search);
  }

  const res = await fetchAuthenticated(`/api/roles?${params}`);

  if (!res.ok) {
    throw new Error("Failed to get roles");
  }

  return res.json();
}

export async function getRoleByName(name: string): Promise<{ role: RoleWithMembers }> {
  const res = await fetchAuthenticated(`/api/roles/${name}`);

  if (!res.ok) {
    throw new Error("Failed to get role");
  }

  return res.json();
}

export async function updateRole(id: number, data: Partial<Role>): Promise<{ role: Role }> {
  const res = await fetchAuthenticated(`/api/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update role");
  }

  return res.json();
};

export async function deleteRole({ id }: { id: number }): Promise<{ role: Role }> {
  const res = await fetchAuthenticated(`/api/roles/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete role");
  }

  return res.json();
}
