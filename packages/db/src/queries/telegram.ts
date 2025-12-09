import type { telegramSchema } from "@bunstack/shared/types/telegram";
import type { z } from "zod";

import { eq } from "drizzle-orm";

import { db } from "@/database";
import { Telegram } from "@bunstack/shared/schemas/telegram";

/**
 * Get a telegram record by provider id.
 *
 * @param providerId - The id of the notification provider.
 * @returns The telegram record if found, null otherwise.
 */
export async function getTelegram(providerId: string) {
  const results = await db.select().from(Telegram).where(eq(Telegram.providerId, providerId));
  return results[0] ?? null;
}

/**
 * Insert a new telegram record.
 *
 * @param providerId - The ID of the notification provider.
 * @param telegram - The telegram record to insert.
 * @returns The inserted telegram record. If the telegram record could not be inserted, an error is thrown.
 */
export async function insertTelegram(providerId: string, telegram: z.infer<typeof telegramSchema>) {
  const insertedTelegrams = await db.insert(Telegram).values({ providerId, ...telegram }).returning();
  const insertedTelegram = insertedTelegrams[0];

  if (!insertedTelegram) {
    throw new Error("Failed to insert telegram");
  }

  return insertedTelegram;
}

/**
 * Update a telegram record.
 *
 * @param providerId - The id of the notification provider.
 * @param telegram - The telegram record to update.
 * @returns The updated telegram record. If the telegram record could not be updated, an error is thrown.
 */
export async function updateTelegram(providerId: string, telegram: z.infer<typeof telegramSchema>) {
  const updatedTelegrams = await db.update(Telegram).set(telegram).where(eq(Telegram.providerId, providerId)).returning();
  const updatedTelegram = updatedTelegrams[0];

  if (!updatedTelegram) {
    throw new Error("Failed to update telegram");
  }

  return updatedTelegram;
}
