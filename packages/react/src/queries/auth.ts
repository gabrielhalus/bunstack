import type { Permission } from "@bunstack/shared/access/types";
import type { Session } from "@bunstack/shared/types/auth";

import { queryOptions } from "@tanstack/react-query";

import { api } from "../lib/http";
import { can } from "@bunstack/shared/access";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: async (): Promise<Session> => {
    const res = await api.auth.$get();

    if (!res.ok) {
      throw new Error("Failed to fetch auth");
    }

    const data = await res.json();

    return {
      ...data,
      isAdmin: data.roles.some(({ isSuperAdmin }) => isSuperAdmin),
      isAuthenticated: true,
      can: (permission: Permission, resource?: Record<string, unknown>) => can(permission, data.user, data.roles, data.policies, resource),
    } satisfies Session;
  },
  staleTime: Infinity,
  throwOnError: true,
  retry: false,
});
