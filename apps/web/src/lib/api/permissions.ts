import type { PermissionCheckInput, UserLike } from "@bunstack/shared/access/types";

import { fetchAuthenticated } from "@/lib/api/http";

// Helper function to convert UserLike to the format expected by the backend
function convertUserForAPI(user: UserLike) {
  return {
    id: user.id,
    roles: user.roles || [],
    attributes: user.attributes || {},
  };
}

export async function checkPermission(params: PermissionCheckInput): Promise<{ allowed: boolean }> {
  const apiParams = {
    ...params,
    user: convertUserForAPI(params.user),
  };

  const res = await fetchAuthenticated("/api/permissions/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiParams),
  });

  if (!res.ok) {
    throw new Error("Failed to check permission");
  }

  return res.json();
}

export async function checkMultiplePermissions(
  params: PermissionCheckInput[]
): Promise<{ [key: string]: boolean }> {
  const apiParams = params.map(param => ({
    ...param,
    user: convertUserForAPI(param.user),
  }));

  const res = await fetchAuthenticated("/api/permissions/check-multiple", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permissions: apiParams }),
  });

  if (!res.ok) {
    throw new Error("Failed to check permissions");
  }

  return res.json();
} 
