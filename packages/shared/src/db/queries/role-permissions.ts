import { inArray } from "drizzle-orm";

import type { RolePermission } from "../types/role-permissions";
import type { Role } from "../types/roles";

import { db } from "../";
import { RolePermissions } from "../schemas/role-permissions";

/**
 * Get all permissions assigned to one or more roles.
 *
 * @param rawRole - A single role object or an array of role objects for which to retrieve permissions.
 * @returns An array of permissions assigned to the role(s) (duplicates possible if permissions overlap).
 */
export async function getRolesPermissions(rawRole: Role | Role[]): Promise<RolePermission[]> {
  const roles = Array.isArray(rawRole) ? rawRole : [rawRole];
  if (!roles.length) {
    return [];
  }

  const roleIds = roles.map(role => role.id);

  const rolePermissions = await db
    .select()
    .from(RolePermissions)
    .where(inArray(RolePermissions.roleId, roleIds))
    .all();

  return rolePermissions.map(({ roleId, permission }) => ({ roleId, permission }));
}
