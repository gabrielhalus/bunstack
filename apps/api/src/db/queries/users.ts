import type { insertUserSchema, User, UserUniqueFields } from "@bunstack/shared/schemas/users";

import { Users } from "@bunstack/shared/schemas/users";
import { eq } from "drizzle-orm";

import { db } from "@/db";

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
