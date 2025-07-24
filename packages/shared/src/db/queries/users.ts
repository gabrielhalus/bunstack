import { count, eq } from "drizzle-orm";

import type { Role } from "../types/roles";
import type { insertUserSchema, User, UserUniqueFields, UserWithRoles } from "../types/users";

import { db } from "../";
import { Users } from "../schemas/users";
import { getRolesPermissions } from "./permissions";
import { getUserRoles } from "./roles";

/**
 * Get all users along with their associated roles.
 *
 * @returns All users.
 */
export async function getUsers(page: number, limit: number): Promise<{ users: Array<UserWithRoles>; total: number }> {
  const users = await db.select().from(Users).limit(limit).offset((page - 1) * limit).all();

  const enrichedUsers = await Promise.all(users.map(async user => ({
    ...user,
    password: undefined,
    roles: await getUserRoles(user),
  })));

  const total = await db.select({ count: count() }).from(Users).get();

  return { users: enrichedUsers, total: Number(total?.count ?? 0) };
}

/**
 * Get a user along with their associated roles by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @param keepPassword - If true, include the password field (for auth purposes).
 * @returns The matching user.
 */
export async function getUser(
  key: keyof UserUniqueFields,
  value: any,
  keepPassword: boolean = false,
): Promise<UserWithRoles | undefined> {
  const user = await db.select().from(Users).where(eq(Users[key], value)).get();

  if (!user) {
    return undefined;
  }

  const enrichedUser = {
    ...user,
    password: keepPassword ? user.password : undefined,
    roles: await getUserRoles(user),
  };

  return enrichedUser;
}

/**
 * Get a user along with their associated roles by its ID, always including the password (for auth).
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching user, with password.
 */
export async function getUserWithPassword(
  key: keyof UserUniqueFields,
  value: any,
): Promise<UserWithRoles | undefined> {
  return getUser(key, value, true);
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
