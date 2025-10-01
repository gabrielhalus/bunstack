import type { RolePermission } from "@bunstack/shared/database/types/role-permissions";
import type { Role } from "@bunstack/shared/database/types/roles";

import { eq } from "drizzle-orm";

import { db } from "@bunstack/shared/database";
import { RolePermissions } from "@bunstack/shared/database/schemas/role-permissions";

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
