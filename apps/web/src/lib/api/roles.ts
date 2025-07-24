import type { Role } from "@bunstack/shared/db/types/roles";

import { fetchAuthenticated } from "./http";

export async function getAllRoles(): Promise<Role[]> {
  const res = await fetchAuthenticated("/api/roles");
  if (!res.ok) {
    throw new Error("Failed to get roles");
  }
  return res.json().then(data => data.roles);
}
