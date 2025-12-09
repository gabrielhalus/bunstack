import type { RolePermission } from "@bunstack/shared/types/role-permissions";
import type { Role } from "@bunstack/shared/types/roles";

import { eq } from "drizzle-orm";

import { db } from "@/database";
import { RolePermissions } from "@bunstack/shared/schemas/role-permissions";

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
    .where(eq(RolePermissions.roleId, role.id));

  return rolePermissions.map(({ roleId, permission }) => ({ roleId, permission }));
}
