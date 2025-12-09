import type { Policy as AuthPolicy, Permission } from "@bunstack/auth/types";
import type { Session } from "@bunstack/shared/types/auth";
import type { Policy as SharedPolicy } from "@bunstack/shared/types/policies";

import { queryOptions } from "@tanstack/react-query";

import { api } from "../lib/http";
import { can } from "@bunstack/auth";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: async (): Promise<Session> => {
    const res = await api.auth.$get();

    if (!res.ok) {
      throw new Error("Failed to fetch auth");
    }

    const data = await res.json();

    // Type assertion: policies from API should have id, but TypeScript might not infer it
    const policies = data.policies as SharedPolicy[];

    // Transform policies to remove id for the can function
    const policiesForCan: AuthPolicy[] = policies.map(({ id, ...policy }) => policy);

    return {
      ...data,
      policies,
      isAdmin: data.roles.some(({ isSuperAdmin }) => isSuperAdmin),
      isAuthenticated: true,
      can: (permission: Permission, resource?: Record<string, unknown>) => can(permission, data.user, data.roles, policiesForCan, resource),
    } satisfies Session;
  },
  staleTime: Infinity,
  throwOnError: true,
  retry: false,
});
