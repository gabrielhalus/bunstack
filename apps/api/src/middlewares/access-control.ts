import type { AppContext } from "@bunstack/api/utils/hono";
import type { Permission } from "@bunstack/auth/types";

import { factory } from "@bunstack/api/utils/hono";
import { can } from "@bunstack/auth";

/**
 * Core authorization middleware that checks permissions
 */
export function requirePermission(
  permission: Permission,
  getResource?: (c: AppContext) => Promise<Record<string, unknown> | undefined> | Record<string, unknown> | undefined,
) {
  return factory.createMiddleware(async (c, next) => {
    const { user, roles, policies } = c.get("authContext");

    const resource = typeof getResource === "function" ? await getResource(c) : undefined;

    const allowed = can(permission, user, roles, policies, resource);
    if (!allowed) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  });
}
