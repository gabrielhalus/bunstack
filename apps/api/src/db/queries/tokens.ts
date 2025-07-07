import type { insertTokenSchema, Token, TokenUniqueFields } from "@bunstack/shared/schemas/tokens";

import { tokensTable } from "@bunstack/shared/schemas/tokens";
import { eq } from "drizzle-orm";

import { db } from "@/db";

/**
 * Get all tokens.
 *
 * @returns All tokens.
 */
export async function getAllTokens(): Promise<Token[]> {
  return db.select().from(tokensTable).all();
}

/**
 * Get a token by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching token.
 */
export async function getToken(key: keyof TokenUniqueFields, value: any): Promise<Token | undefined> {
  return db.select().from(tokensTable).where(eq(tokensTable[key], value)).get();
}

/**
 * Insert a new token.
 *
 * @param token - The token data to insert.
 * @returns The inserted token.
 */
export async function insertToken(token: typeof insertTokenSchema._type): Promise<Token> {
  return db.insert(tokensTable).values(token).returning().get();
}

/**
 * Delete all tokens.
 *
 * @returns The deleted tokens.
 */
export async function deleteAllTokens(): Promise<Token[]> {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  return db.delete(tokensTable).returning().all();
}

/**
 * Delete a token by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The deleted token.
 */
export async function deleteToken(key: keyof TokenUniqueFields, value: any): Promise<Token | undefined> {
  return db.delete(tokensTable).where(eq(tokensTable[key], value)).returning().get();
}
