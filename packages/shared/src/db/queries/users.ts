import { eq } from "drizzle-orm";

import type { Role } from "../types/roles";
import type { insertUserSchema, User, UserUniqueFields } from "../types/users";

import { db } from "../";
import { Users } from "../schemas/users";
import { getRolesPermissions } from "./permissions";
import { getUserRoles } from "./roles";

/**
 * Get all users.
 *
 * @returns All users.
 */
export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(Users).all();
}

/**
 * Get a user by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching user.
 */
export async function getUser(key: keyof UserUniqueFields, value: any): Promise<User | undefined> {
  return await db.select().from(Users).where(eq(Users[key], value)).get();
}

/**
 * Retrieves a user along with their associated roles and permissions.
 *
 * @param key - The unique field key to search by (e.g., "id", "email").
 * @param value - The value to search for.
 * @returns An object containing the user (or undefined if not found), their roles, and their permissions.
 */
export async function getUserWithContext(key: keyof UserUniqueFields, value: any): Promise<{
  user: User | undefined;
  roles: Role[];
  permissions: string[];
}> {
  const user = await db.select().from(Users).where(eq(Users[key], value)).get();
  if (!user) {
    return { user: undefined, roles: [], permissions: [] };
  }

  const roles = await getUserRoles(user);
  const permissions = (await getRolesPermissions(roles)).map(permission => permission.name);

  return { user, roles, permissions };
}

/**
 * Insert a new user.
 *
 * @param user - The user data to insert.
 * @returns The inserted user.
 */
export async function insertUser(user: typeof insertUserSchema._type): Promise<User> {
  return await db.insert(Users).values(user).returning().get();
}

/**
 * Delete a user by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The deleted user.
 */
export async function deleteUser(key: keyof UserUniqueFields, value: any): Promise<User | undefined> {
  return await db.delete(Users).where(eq(Users[key], value)).returning().get();
}
