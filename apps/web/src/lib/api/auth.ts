import type { Policy } from "@bunstack/shared/access/types";
import type { RoleWithPermissions } from "@bunstack/shared/db/types/roles";
import type { User } from "@bunstack/shared/db/types/users";

import { api } from "../http";

export async function getCurrentUser(): Promise<{ user: User; roles: RoleWithPermissions[]; policies: Policy[] }> {
  const res = await api.auth.me.$get();

  if (res.status === 401) {
    throw new Error("Not authenticated: invalid token");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
}

export async function logout() {
  const res = await api.auth.logout.$post();

  if (!res.ok) {
    throw new Error("Failed to logout");
  }

  return res.json();
}
