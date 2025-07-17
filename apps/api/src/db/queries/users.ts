import type { insertUserSchema, User, UserUniqueFields } from "@bunstack/shared/schemas/users";

import { rolesTable } from "@bunstack/shared/schemas/roles";
import { userRolesTable, usersTable } from "@bunstack/shared/schemas/users";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";

/**
 * Get all users.
 *
 * @returns All users.
 */
export async function getAllUsers(): Promise<User[]> {
  const users = await db.select().from(usersTable).all();

  if (!users.length)
    return [];

  // Get all user-role relations with role info
  const userRoles = await db
    .select({
      userId: userRolesTable.userId,
      id: rolesTable.id,
      label: rolesTable.label,
    })
    .from(userRolesTable)
    .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
    .orderBy(desc(rolesTable.sortOrder))
    .all();

  // Map userId to array of roles
  const userRoleMap = new Map<string, { id: string; label: string }[]>();
  for (const { userId, id, label } of userRoles) {
    if (!userRoleMap.has(userId))
      userRoleMap.set(userId, []);
    userRoleMap.get(userId)!.push({ id, label });
  }

  return users.map(user => ({
    ...user,
    roles: userRoleMap.get(user.id) ?? [],
  }));
}

/**
 * Get a user by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching user with roles.
 */
export async function getUser(key: keyof UserUniqueFields, value: any): Promise<User | undefined> {
  const user = db.select().from(usersTable).where(eq(usersTable[key], value)).get();
  if (!user)
    return undefined;

  const roles = await db
    .select({ id: rolesTable.id, label: rolesTable.label })
    .from(userRolesTable)
    .where(eq(userRolesTable.userId, value))
    .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
    .orderBy(desc(rolesTable.sortOrder))
    .all();

  return {
    ...user,
    roles,
  };
}

/**
 * Insert a new user.
 *
 * @param user - The user data to insert.
 * @returns The inserted user.
 */
export async function insertUser(user: typeof insertUserSchema._type): Promise<Omit<User, "roles">> {
  const insertedUser = db.insert(usersTable).values(user).returning().get();
  const defaultRole = db.select().from(rolesTable).where(eq(rolesTable.isDefault, true)).get();

  if (defaultRole) {
    await db.insert(userRolesTable).values({ userId: insertedUser.id, roleId: defaultRole.id });
  }

  return insertedUser;
}

/**
 * Delete a user by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The deleted user.
 */
export async function deleteUser(key: keyof UserUniqueFields, value: any): Promise<Omit<User, "roles"> | undefined> {
  const deletedUser = db.delete(usersTable).where(eq(usersTable[key], value)).returning().get();

  if (deletedUser) {
    await db.delete(userRolesTable).where(eq(userRolesTable.userId, deletedUser.id));
  }

  return deletedUser;
}
