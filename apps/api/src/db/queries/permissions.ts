import type { Permission } from "@bunstack/shared/schemas/permissions";

import { permissionsTable } from "@bunstack/shared/schemas/permissions";

import { db } from "@/db";

/**
 * Get all permissions.
 *
 * @returns All permissions.
 */
export async function getAllPermissions(): Promise<Permission[]> {
  return db.select().from(permissionsTable).all();
}
