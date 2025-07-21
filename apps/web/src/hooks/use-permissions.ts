import type { ResourceContext, UserLike } from "@bunstack/shared/access/types";

import { useQuery } from "@tanstack/react-query";

import { multiplePermissionsQueryOptions, permissionQueryOptions } from "@/lib/queries/permissions";
import { useAuth } from "./use-auth";

type UsePermissionReturn =
  | {
    allowed: false;
    loading: true;
    error: null;
  }
  | {
    allowed: boolean;
    loading: false;
    error: Error | null;
  };

type UseMultiplePermissionsReturn =
  | {
    permissions: Record<string, boolean>;
    loading: true;
    error: null;
  }
  | {
    permissions: Record<string, boolean>;
    loading: false;
    error: Error | null;
  };

export function usePermission(
  permissionName: string,
  user: UserLike | null | undefined,
  resource?: ResourceContext,
): UsePermissionReturn {
  const query = useQuery({
    ...permissionQueryOptions({
      permissionName,
      user: user!,
      resource,
    }),
    enabled: !!user, // Only run query if user exists
  });

  const { data, isLoading, isError, error } = query;

  if (isLoading || !user) {
    return {
      allowed: false,
      loading: true,
      error: null,
    };
  }

  return {
    allowed: Boolean(data?.allowed),
    loading: false,
    error: isError ? error : null,
  };
}

export function useMultiplePermissions(
  permissions: Array<{ name: string; resource?: ResourceContext }>,
  user: UserLike | null | undefined,
): UseMultiplePermissionsReturn {
  const query = useQuery({
    ...multiplePermissionsQueryOptions(
      permissions.map(p => ({
        permissionName: p.name,
        user: user!,
        resource: p.resource,
      }))
    ),
    enabled: !!user && permissions.length > 0,
  });

  const { data, isLoading, isError, error } = query;

  if (isLoading || !user) {
    return {
      permissions: {},
      loading: true,
      error: null,
    };
  }

  return {
    permissions: data || {},
    loading: false,
    error: isError ? error : null,
  };
}

// Add a convenience hook that works directly with the auth user
export function usePermissionWithAuth(
  permissionName: string,
  resource?: ResourceContext,
) {
  const { user } = useAuth();
  return usePermission(permissionName, user, resource);
}

export function useMultiplePermissionsWithAuth(
  permissions: Array<{ name: string; resource?: ResourceContext }>,
) {
  const { user } = useAuth();
  return useMultiplePermissions(permissions, user);
} 