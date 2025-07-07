import type { Role, RoleUniqueFields } from "@bunstack/shared/schemas/roles";

import { roles as rolesTable } from "@bunstack/shared/schemas/roles";
import { eq } from "drizzle-orm";

import { db } from "@/db";

/**
 * Get all roles.
 *
 * @returns All roles.
 */
export async function getAllRoles(): Promise<Role[]> {
  return db.select().from(rolesTable).all();
}

/**
 * Get a role by its refresh role.
 *
 * @param id - The ID to look up.
 * @returns The matching role.
 */
export async function getUniqueRole(key: keyof RoleUniqueFields, value: any): Promise<Role | undefined> {
  return db.select().from(rolesTable).where(eq(rolesTable[key], value)).get();
}
