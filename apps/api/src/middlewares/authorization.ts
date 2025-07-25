import type { Role } from "@bunstack/shared/db/types/roles";
import type { User } from "@bunstack/shared/db/types/users";

import { can } from "@bunstack/shared/access";
import { createFactory } from "hono/factory";

type Env = {
  Variables: {
    authContext: {
      user: User;
      roles: Role[];
      permissions: string[];
    };
  };
};

const factory = createFactory<Env>();

/**
 * Core authorization middleware that checks permissions
 * @param permissions - Single permission or array of permissions to check
 * @param options - Configuration options
 * @param options.resourceExtractor - Optional function to extract resource data from the request
 * @param options.logic - The logic to use to check the permissions (AND or OR)
 * @param options.allowOwnResource - Whether to allow the user to access their own resource
 * @param options.userIdParam - The parameter name containing the user ID (default: "id")
 * @returns Middleware function
 */
export function requirePermission(
  permissions: string | string[],
  options: {
    resourceExtractor?: (c: any) => Record<string, unknown>;
    logic?: "AND" | "OR";
    allowOwnResource?: boolean;
    userIdParam?: string;
  } = {},
) {
  const { resourceExtractor, logic = "AND", allowOwnResource = false, userIdParam = "id" } = options;

  return factory.createMiddleware(async (c, next) => {
    const resource = resourceExtractor ? resourceExtractor(c) : undefined;
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];

    // Check if user is accessing their own resource
    if (allowOwnResource && resource?.id) {
      const currentUserId = c.var.authContext.user.id;
      const resourceUserId = c.req.param(userIdParam);
      if (resourceUserId === currentUserId) {
        await next();
        return;
      }
    }

    // Check permissions based on logic
    if (logic === "AND") {
      for (const permission of permissionArray) {
        const authorized = await can(
          permission,
          c.var.authContext.user,
          c.var.authContext.roles,
          resource,
        );

        if (!authorized) {
          return c.json({ success: false, error: "Unauthorized" }, 403);
        }
      }
    } else { // OR logic
      let hasPermission = false;
      for (const permission of permissionArray) {
        const authorized = await can(
          permission,
          c.var.authContext.user,
          c.var.authContext.roles,
          resource,
        );

        if (authorized) {
          hasPermission = true;
          break;
        }
      }

      if (!hasPermission) {
        return c.json({ success: false, error: "Unauthorized" }, 403);
      }
    }

    await next();
  });
}

// Convenience methods for common use cases
export function requirePermissionForResource(permission: string, idParam: string = "id") {
  return requirePermission(permission, {
    resourceExtractor: c => ({ id: c.req.param(idParam) }),
  });
}

export function requirePermissionForBody(permission: string, resourceExtractor: (body: any) => Record<string, unknown>) {
  return requirePermission(permission, {
    resourceExtractor: c => resourceExtractor(c.req.json()),
  });
}

export function requireOwnResource(permission: string, userIdParam: string = "id") {
  return requirePermission(permission, {
    resourceExtractor: c => ({ id: c.req.param(userIdParam) }),
    allowOwnResource: true,
    userIdParam,
  });
}
