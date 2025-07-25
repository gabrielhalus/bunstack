import type { Role } from "@bunstack/shared/db/types/roles";
import type { User } from "@bunstack/shared/db/types/users";

import { fetchAuthenticated } from "@/lib/api/http";

export async function getCurrentUser(): Promise<{ user: User; roles: Role[]; permissions: string[] }> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Not authenticated: missing access token");
  }

  const res = await fetchAuthenticated("/api/auth/me");

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    throw new Error("Not authenticated: invalid token");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await res.json();
}

export async function logout() {
  const res = await fetchAuthenticated("/api/auth/logout", { method: "POST" });

  if (!res.ok) {
    throw new Error("Failed to logout");
  }

  return res.json();
}
