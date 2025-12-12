import type { Session } from "@bunstack/auth/types";
import type { Permission } from "@bunstack/shared/types/permissions";

import { queryOptions } from "@tanstack/react-query";

import { api } from "../lib/http";
import { can } from "@bunstack/auth";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: async (): Promise<Session | null> => {
    const res = await api.auth.$get();

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    const policies = data.policies.map(({ id, ...policy }: any) => policy);

    return {
      ...data,
      policies,
      isAdmin: data.roles.some(({ isSuperAdmin }) => isSuperAdmin),
      isAuthenticated: true,
      can: (permission: Permission, resource?: Record<string, unknown>) => can(permission, data.user, data.roles, policies, resource),
    } satisfies Session;
  },
  staleTime: Infinity,
  retry: false,
});
