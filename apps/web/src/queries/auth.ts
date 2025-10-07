import type { Permission } from "@bunstack/shared/access/types";
import type { AuthResult } from "@bunstack/shared/types/auth";

import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/http";
import { can } from "@bunstack/shared/access";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: async (): Promise<AuthResult> => {
    const res = await api.auth.$get();

    if (!res.ok) {
      throw new Error("Failed to fetch auth");
    }

    const data = await res.json();

    return {
      ...data,
      can: (permission: Permission, resource?: Record<string, unknown>) => can(permission, data.user, data.roles, data.policies, resource),
      isAdmin: data.roles.some(r => r.isSuperAdmin),
      isAuthenticated: true,
    } satisfies AuthResult;
  },
  staleTime: Infinity,
  throwOnError: true,
  retry: false,
});
