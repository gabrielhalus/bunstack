import type { insertTokenSchema, Token } from "../types/tokens";
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
  return db.select().from(Tokens);
}

/**
 * Get a token by its unique field.
 *
 * @param id - The ID to search for.
 * @returns The matching token.
 */
export async function getTokenById(id: Token["id"]): Promise<Token | undefined> {
  const tokens = await db.select().from(Tokens).where(eq(Tokens.id, id));
  return tokens[0];
}

/**
 * Insert a new token.
 *
 * @param token - The token data to insert.
 * @returns The inserted token.
 */
export async function insertToken(token: z.infer<typeof insertTokenSchema>): Promise<Token> {
  const insertedTokens = await db.insert(Tokens).values(token).returning();
  const insertedToken = insertedTokens[0];

  if (!insertedToken) {
    throw new Error("Failed to insert token");
  }

  return insertedToken;
}

/**
 * Delete all tokens.
 *
 * @returns The deleted tokens.
 */
export async function deleteAllTokens(): Promise<Token[]> {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  return db.delete(Tokens).returning();
}

/**
 * Delete a token by its unique field.
 *
 * @param id - The ID to search for.
 * @returns The deleted token.
 */
export async function deleteToken(id: Token["id"]): Promise<Token | undefined> {
  const deletedTokens = await db.delete(Tokens).where(eq(Tokens.id, id)).returning();
  return deletedTokens[0];
}
