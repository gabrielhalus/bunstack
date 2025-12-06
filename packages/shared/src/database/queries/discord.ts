import type { discordSchema } from "../types/discord";
import type { z } from "zod";

import { eq } from "drizzle-orm";

import { db } from "..";
import { Discord } from "../schemas/discord";

/**
 * Get a discord record by provider id.
 *
 * @param providerId - The id of the notification provider.
 * @returns The discord record if found, null otherwise.
 */
export async function getDiscord(providerId: string) {
  const results = await db.select().from(Discord).where(eq(Discord.providerId, providerId));
  return results[0] ?? null;
}

/**
 * Insert a new discord record.
 *
 * @param providerId - The id of the notification provider.
 * @param discord - The discord record to insert.
 * @returns The inserted discord record. If the discord record could not be inserted, an error is thrown.
 */
export async function insertDiscord(providerId: string, discord: z.infer<typeof discordSchema>) {
  const insertedDiscords = await db.insert(Discord).values({ providerId, ...discord }).returning();
  const insertedDiscord = insertedDiscords[0];

  if (!insertedDiscord) {
    throw new Error("Failed to insert discord");
  }

  return insertedDiscord;
}

/**
 * Update a discord record.
 *
 * @param providerId - The id of the notification provider.
 * @param discord - The discord record to update.
 * @returns The updated discord record. If the discord record could not be updated, an error is thrown.
 */
export async function updateDiscord(providerId: string, discord: z.infer<typeof discordSchema>) {
  const updatedDiscords = await db.update(Discord).set(discord).where(eq(Discord.providerId, providerId)).returning();
  const updatedDiscord = updatedDiscords[0];

  if (!updatedDiscord) {
    throw new Error("Failed to update discord");
  }

  return updatedDiscord;
}
