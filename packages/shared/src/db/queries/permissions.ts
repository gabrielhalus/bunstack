import { inArray } from "drizzle-orm";

import type { Permission } from "../types/permissions";
import type { Role } from "../types/roles";

import { db } from "../";
import { Permissions } from "../schemas/permissions";
import { RolePermissions } from "../schemas/role-permissions";

/**
 * Retrieves all permissions associated with the given roles.
 *
 * @param roles - An array of role objects for which to fetch permissions.
 * @returns A promise that resolves to an array of permissions assigned to the provided roles.
 */
export async function getRolesPermissions(roles: Role[]): Promise<Permission[]> {
  if (!roles.length) {
    return [];
  }

  const roleIds = roles.map(role => role.id);
  const rolePermissions = await db.select().from(RolePermissions).where(inArray(RolePermissions.roleId, roleIds)).all();

  const rolePermissionIds = rolePermissions.map(rolePermission => rolePermission.permissionId);
  return await db.select().from(Permissions).where(inArray(Permissions.id, rolePermissionIds)).all();
}
