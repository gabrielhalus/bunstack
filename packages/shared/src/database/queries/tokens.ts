import type { insertTokenSchema, Token, TokenUniqueFields } from "../types/tokens";
import type z from "zod";

import { eq } from "drizzle-orm";

import { db } from "@bunstack/shared/database";
import { Tokens } from "@bunstack/shared/database/schemas/tokens";

/**
 * Get all tokens.
 *
 * @returns All tokens.
 */
export async function getAllTokens(): Promise<Token[]> {
  return db.select().from(Tokens).all();
}

/**
 * Get a token by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching token.
 */
export async function getToken<T extends keyof TokenUniqueFields>(key: T, value: typeof Tokens[T]["_"]["data"]): Promise<Token | undefined> {
  return db.select().from(Tokens).where(eq(Tokens[key], value)).get();
}

/**
 * Insert a new token.
 *
 * @param token - The token data to insert.
 * @returns The inserted token.
 */
export async function insertToken(token: z.infer<typeof insertTokenSchema>): Promise<Token> {
  return db.insert(Tokens).values(token).returning().get();
}

/**
 * Delete all tokens.
 *
 * @returns The deleted tokens.
 */
export async function deleteAllTokens(): Promise<Token[]> {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  return db.delete(Tokens).returning().all();
}

/**
 * Delete a token by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The deleted token.
 */
export async function deleteToken<T extends keyof TokenUniqueFields>(key: T, value: typeof Tokens[T]["_"]["data"]): Promise<Token | undefined> {
  return db.delete(Tokens).where(eq(Tokens[key], value)).returning().get();
}
