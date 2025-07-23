import type { Role } from "@bunstack/shared/db/types/roles";
import type { User } from "@bunstack/shared/db/types/users";
import type { LinkOptions } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/queries/auth";
import { queryClient } from "@/main";

// Core auth state types
type AuthState = {
  user: User;
  roles: Role[];
  permissions: string[];
};

type AuthResult = {
  user: User;
  roles: Role[];
  can: (permission: string) => boolean;
  isAdmin: boolean;
  isAuthenticated: true;
};

type UnauthenticatedResult = {
  user: null;
  roles: undefined;
  can: (permission: string) => false;
  isAdmin: false;
  isAuthenticated: false;
};

// Hook return types
type UseAuthLoading = {
  user: undefined;
  roles: undefined;
  can: () => false;
  isAdmin: false;
  loading: true;
  isError: false;
  isAuthenticated: false;
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

// Non-component auth function types
type AuthFunctionReturn = AuthResult | UnauthenticatedResult;

// Options for the hook
type UseAuthOptions = {
  redirect?: LinkOptions["to"] | false;
};

// Core auth logic (reusable between hook and function)
function createAuthResult(authState: AuthState): AuthResult {
  return {
    user: authState.user,
    roles: authState.roles,
    can: (permission: string) => authState.permissions.includes(permission),
    isAdmin: authState.roles.some(role => role.isSuperAdmin),
    isAuthenticated: true,
  };
}

function createUnauthenticatedResult(): UnauthenticatedResult {
  return {
    user: null,
    roles: undefined,
    can: (_permission: string) => false,
    isAdmin: false,
    isAuthenticated: false,
  };
}

// Singleton cache for non-component auth
let authCache: {
  promise: Promise<AuthFunctionReturn> | null;
  result: AuthFunctionReturn | null;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  if (!authCache)
    return false;
  return Date.now() - authCache.timestamp < CACHE_DURATION;
}

function clearAuthCache(): void {
  authCache = null;
}

// Non-component auth function with caching
export async function auth(): Promise<AuthFunctionReturn> {
  // Check if we have a valid cached result
  if (authCache && authCache.result && isCacheValid()) {
    return authCache.result;
  }

  // Check if we have an ongoing request
  if (authCache?.promise) {
    return authCache.promise;
  }

  // Create new request using the existing query client
  const authPromise = (async () => {
    try {
      // Use the same query options that the hook uses
      const authState = await queryClient.fetchQuery(userQueryOptions);
      const result = createAuthResult(authState);

      // Cache the successful result
      authCache = {
        promise: null,
        result,
        timestamp: Date.now(),
      };

      return result;
    } catch {
      const result = createUnauthenticatedResult();

      // Cache the error result (shorter cache for errors)
      authCache = {
        promise: null,
        result,
        timestamp: Date.now(),
      };

      return result;
    }
  })();

  // Store the promise to prevent duplicate requests
  authCache = {
    promise: authPromise,
    result: null,
    timestamp: Date.now(),
  };

  return authPromise;
}

// Function to invalidate auth cache (useful after login/logout)
export function invalidateAuth(): void {
  clearAuthCache();
  // Also invalidate the React Query cache
  queryClient.invalidateQueries({ queryKey: ["get-current-user"] });
}

// React hook with overloads
export function useAuth(): UseAuthReturn;
export function useAuth(options: { redirect: LinkOptions["to"] }): UseAuthReturn;
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { redirect = false } = options;
  const router = useRouter();

  // Use the query with optimized caching
  const { data, isPending, isError } = useQuery({
    ...userQueryOptions,
    // Additional optimizations
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Handle redirect logic
  if (!isPending && (isError || !data?.user) && redirect) {
    router.navigate({ to: redirect });
  }

  // Loading state
  if (isPending) {
    return {
      user: undefined,
      roles: undefined,
      can: () => false,
      isAdmin: false,
      loading: true,
      isError: false,
      isAuthenticated: false,
    };
  }

  // Error state
  if (isError || !data?.user) {
    return {
      ...createUnauthenticatedResult(),
      loading: false,
      isError: true,
    };
  }

  // Success state
  return {
    ...createAuthResult(data),
    loading: false,
    isError: false,
  };
}
