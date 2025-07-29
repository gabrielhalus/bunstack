import { eq } from "drizzle-orm";

import type { RolePermission } from "../types/role-permissions";
import type { Role } from "../types/roles";

import { db } from "../";
import { RolePermissions } from "../schemas/role-permissions";

/**
 * Retrieves all permissions associated with a given role.
 *
 * @param role - The role object for which to fetch permissions.
 * @returns An array of RolePermission objects representing the permissions assigned to the specified role.
 */
export async function getRolePermissions(role: Role): Promise<RolePermission[]> {
  const rolePermissions = await db
    .select()
    .from(RolePermissions)
    .where(eq(RolePermissions.roleId, role.id))
    .all();

  return rolePermissions.map(({ roleId, permission }) => ({ roleId, permission }));
}
