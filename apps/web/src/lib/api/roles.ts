import type { Role } from "@bunstack/shared/schemas/roles";

import { fetchAuthenticated } from "@/lib/api/http";

export async function getAllRoles(): Promise<Role[]> {
  const res = await fetchAuthenticated("/api/roles");
  if (!res.ok) {
    throw new Error("Failed to get roles");
  }
  return res.json().then(data => data.roles);
}

export async function deleteRole({ id }: { id: string }): Promise<Role> {
  const res = await fetchAuthenticated(`/api/roles/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete role");
  }

  return res.json();
}
