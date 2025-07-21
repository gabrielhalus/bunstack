import type { PermissionCheckInput } from "@bunstack/shared/access/types";

import { queryOptions } from "@tanstack/react-query";

import { checkPermission, checkMultiplePermissions } from "@/lib/api/permissions";

export const permissionQueryOptions = (params: PermissionCheckInput) =>
  queryOptions({
    queryKey: ["check-permission", params.permissionName, params.user, params.resource],
    queryFn: () => checkPermission(params),
    enabled: !!params.user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

export const multiplePermissionsQueryOptions = (params: PermissionCheckInput[]) =>
  queryOptions({
    queryKey: ["check-multiple-permissions", params],
    queryFn: () => checkMultiplePermissions(params),
    enabled: params.length > 0 && params.every(p => !!p.user),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
