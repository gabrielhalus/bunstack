import { eq } from "drizzle-orm";

import type { insertUserSchema, User } from "@bunstack/shared/schemas/users";

import { db } from "@/db";
import { userRoles, users } from "@bunstack/shared/schemas/users";

/**
 * Get all users.
 *
 * @returns All users.
 */
export async function getAllUsers(): Promise<User[]> {
  const allUsers = await db.select().from(users).all();
  const allRoles = await db.select().from(userRoles).all();

  return allUsers.map(user => ({
    ...user,
    roles: allRoles.filter(role => role.userId === user.id).map(role => role.role),
  }));
}

/**
 * Get a user by its ID.
 *
 * @param id - The ID to look up.
 * @returns The matching user with roles.
 */
export async function getUserById(id: string): Promise<User | undefined> {
  const user = db.select().from(users).where(eq(users.id, id)).get();

  if (!user) {
    return undefined;
  }

  const roles = db.select().from(userRoles).where(eq(userRoles.userId, id)).all();

  return {
    ...user,
    roles: roles.map(role => role.role),
  };
}

/**
 * Get a user by its email.
 *
 * @param email - The email to look up.
 * @returns The matching user.
 */
export async function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email.toLowerCase())).get();
}

/**
 * Insert a new user.
 *
 * @param user - The user data to insert.
 * @returns The inserted user.
 */
export async function insertUser(user: typeof insertUserSchema._type) {
  return db.insert(users).values(user).returning().get();
}

/**
 * Delete a user by its ID.
 *
 * @param id - The ID of the user to delete.
 * @returns The deleted user.
 */
export async function deleteUserById(id: string) {
  return db.delete(users).where(eq(users.id, id)).returning().get();
}
