import type { Role, RoleWithMembers, RoleWithMembersCount } from "@bunstack/shared/db/types/roles";

import { fetchAuthenticated } from "./http";

export async function getAllRoles(): Promise<RoleWithMembersCount[]> {
  const res = await fetchAuthenticated("/api/roles");
  if (!res.ok) {
    throw new Error("Failed to get roles");
  }
  return res.json().then(data => data.roles);
}

export async function getRoleByName(name: string): Promise<RoleWithMembers> {
  const res = await fetchAuthenticated(`/api/roles/${name}`);
  if (!res.ok) {
    throw new Error("Failed to get role");
  }
  return res.json().then(data => data.role);
}

export async function deleteRole({ id }: { id: number }): Promise<Role> {
  const res = await fetchAuthenticated(`/api/roles/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete role");
  }

  return res.json().then(data => data.role);
}
