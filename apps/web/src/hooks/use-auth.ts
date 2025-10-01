import type { Permission, Policy } from "@bunstack/shared/access/types";
import type { Role, RoleWithPermissions } from "@bunstack/shared/database/types/roles";
import type { User } from "@bunstack/shared/database/types/users";
import type { LinkOptions } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/queries/auth";
import { queryClient } from "@/main";
import { can as sharedCan } from "@bunstack/shared/access";

// Core auth state types
type AuthState = {
  user: User;
  roles: RoleWithPermissions[];
  policies: Policy[];
};

function isAdmin(roles: Role[]): boolean {
  return roles.some(role => role.isSuperAdmin);
}

type AuthResult = {
  user: User;
  roles: RoleWithPermissions[];
  policies: Policy[];
  isAdmin: boolean;
  isAuthenticated: true;
  can: (permission: Permission, resource?: Record<string, unknown>) => boolean;
};

type UnauthenticatedResult = {
  user: null;
  roles: undefined;
  permissions: undefined;
  policies: undefined;
  isAdmin: false;
  isAuthenticated: false;
  can: () => false;
};

type UseAuthLoading = {
  user: undefined;
  roles: undefined;
  permissions: undefined;
  policies: undefined;
  isAdmin: false;
  loading: true;
  isError: false;
  isAuthenticated: false;
  can: () => false;
};

type UseAuthError = UnauthenticatedResult & {
  loading: false;
  isError: true;
};

type UseAuthSuccess = AuthResult & {
  loading: false;
  isError: false;
};

type UseAuthReturn = UseAuthLoading | UseAuthError | UseAuthSuccess;

type AuthFunctionReturn = AuthResult | UnauthenticatedResult;

type UseAuthOptions = {
  redirect?: LinkOptions["to"] | false;
};

// Factory
function createAuthResult(authState: AuthState): AuthResult {
  return {
    ...authState,
    isAdmin: isAdmin(authState.roles),
    isAuthenticated: true,
    can: (permission: Permission, resource?: Record<string, unknown>) => {
      return sharedCan(permission, authState.user, authState.roles, authState.policies, resource);
    },
  };
}

function createUnauthenticatedResult(): UnauthenticatedResult {
  return {
    user: null,
    roles: undefined,
    permissions: undefined,
    policies: undefined,
    isAdmin: false,
    isAuthenticated: false,
    can: () => false,
  };
}

// Cache
let authCache: {
  promise: Promise<AuthFunctionReturn> | null;
  result: AuthFunctionReturn | null;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

function isCacheValid(): boolean {
  if (!authCache)
    return false;
  return Date.now() - authCache.timestamp < CACHE_DURATION;
}

function clearAuthCache(): void {
  authCache = null;
}

export async function auth(): Promise<AuthFunctionReturn> {
  if (authCache && authCache.result && isCacheValid()) {
    return authCache.result;
  }

  if (authCache?.promise) {
    return authCache.promise;
  }

  const authPromise = (async () => {
    try {
      const authState = await queryClient.fetchQuery(userQueryOptions);
      const result = createAuthResult(authState);

      authCache = {
        promise: null,
        result,
        timestamp: Date.now(),
      };

      return result;
    } catch {
      const result = createUnauthenticatedResult();

      authCache = {
        promise: null,
        result,
        timestamp: Date.now(),
      };

      return result;
    }
  })();

  authCache = {
    promise: authPromise,
    result: null,
    timestamp: Date.now(),
  };

  return authPromise;
}

export function invalidateAuth(): void {
  clearAuthCache();
  queryClient.invalidateQueries({ queryKey: ["get-current-user"] });
}

export function useAuth(): UseAuthReturn;
export function useAuth(options: { redirect: LinkOptions["to"] }): UseAuthReturn;
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { redirect = false } = options;
  const router = useRouter();

  const { data, isPending, isError } = useQuery({
    ...userQueryOptions,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (!isPending && (isError || !data?.user) && redirect) {
    router.navigate({ to: redirect });
  }

  if (isPending) {
    return {
      user: undefined,
      roles: undefined,
      permissions: undefined,
      policies: undefined,
      isAdmin: false,
      loading: true,
      isError: false,
      isAuthenticated: false,
      can: () => false,
    };
  }

  if (isError || !data?.user) {
    return {
      ...createUnauthenticatedResult(),
      loading: false,
      isError: true,
    };
  }

  return {
    ...createAuthResult(data),
    loading: false,
    isError: false,
  };
}
