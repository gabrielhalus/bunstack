import type { insertRoleSchema, Role, RoleUniqueFields } from "@bunstack/shared/schemas/roles";

import { rolesTable } from "@bunstack/shared/schemas/roles";
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
 * Get a role by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching role.
 */
export async function getRole(key: keyof RoleUniqueFields, value: any): Promise<Role | undefined> {
  return db.select().from(rolesTable).where(eq(rolesTable[key], value)).get();
}

/**
 * Insert a new role.
 *
 * @param role - The role data to insert.
 * @returns The inserted role.
 */
export async function insertRole(role: typeof insertRoleSchema._type): Promise<Role> {
  return db.insert(rolesTable).values(role).returning().get();
}

/**
 * Delete a role by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The deleted role.
 */
export async function deleteRole(key: keyof RoleUniqueFields, value: any): Promise<Role | undefined> {
  return db.delete(rolesTable).where(eq(rolesTable[key], value)).returning().get();
}
