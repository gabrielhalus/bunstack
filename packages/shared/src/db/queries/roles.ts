import { eq, inArray } from "drizzle-orm";

import { UserRoles } from "db/schemas/user-roles";

import type { RoleUniqueFields } from "../types/roles";
import type { User } from "../types/users";

import { db } from "../";
import { Roles } from "../schemas/roles";

/**
 * Get all roles.
 *
 * @returns All roles.
 */
export async function getAllRoles() {
  return await db.select().from(Roles).all();
}

/**
 * Get a role by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching role.
 */
export async function getRole(key: keyof RoleUniqueFields, value: any) {
  return await db.select().from(Roles).where(eq(Roles[key], value)).get();
}

/**
 * Get all roles assigned to a specific user.
 *
 * @param user - The user object for which to retrieve roles.
 * @returns An array of roles assigned to the user.
 */
export async function getUserRoles(user: User) {
  const userToRoles = await db.select().from(UserRoles).where(eq(UserRoles.userId, user.id)).all();
  const roleIds = userToRoles.map(ur => ur.roleId);

  const userRoles = await db.select().from(Roles).where(inArray(Roles.id, roleIds)).all();

  return userRoles;
}
