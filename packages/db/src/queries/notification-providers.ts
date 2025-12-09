import type { insertNotificationProviderSchema, NotificationProviderOrderBy, updateNotificationProviderSchema } from "@bunstack/shared/types/notification-providers";
import type { OrderBy } from "@bunstack/shared/types/pagination";
import type z from "zod";

import { asc, count, desc, eq, like } from "drizzle-orm";

import { db } from "@/database";
import { getDiscord } from "@/queries/discord";
import { getTelegram } from "@/queries/telegram";
import { NotificationProviders } from "@bunstack/shared/schemas/notification-providers";
import { NotificationProviderType } from "@bunstack/shared/types/notification-providers";

/**
 * Retrieves a paginated list of notification providers, each including their associated config based on type.
 *
 * @param page - The page number to retrieve (1-based).
 * @param limit - The number of notification providers to retrieve per page.
 * @param orderBy - Optional ordering criteria for the notification provider.
 * @param search - Optional search term to filter by name or email.
 * @returns An object containing an array of notification providers with their configs and the total number of notification providers.
 */
export async function getNotificationProviders(page: number, limit: number, orderBy?: OrderBy<NotificationProviderOrderBy>, search?: string) {
  const offset = (page) * limit;

  const searchConditions = search ? like(NotificationProviders.name, `%${search}%`) : undefined;

  const baseQuery = db.select().from(NotificationProviders).where(searchConditions);

  const orderedQuery = (() => {
    if (typeof orderBy === "string") {
      return baseQuery.orderBy(NotificationProviders[orderBy]);
    }

    if (orderBy && typeof orderBy === "object") {
      const { field, direction } = orderBy;
      const column = NotificationProviders[field];
      return direction === "asc" ? baseQuery.orderBy(asc(column)) : baseQuery.orderBy(desc(column));
    }

    return baseQuery;
  })();

  const providers = await orderedQuery.limit(limit).offset(offset);

  const totalResult = await db.select({ count: count() }).from(NotificationProviders).where(searchConditions);

  const { count: total = 0 } = totalResult[0] ?? {};

  const providersWithConfigs = await Promise.all(
    providers.map(async (provider) => {
      if (provider.type === NotificationProviderType.DISCORD) {
        const config = await getDiscord(provider.id);
        if (!config) {
          throw new Error(`Discord config not found for provider ${provider.id}`);
        }
        return { ...provider, ...config, type: NotificationProviderType.DISCORD as const };
      }

      if (provider.type === NotificationProviderType.TELEGRAM) {
        const config = await getTelegram(provider.id);
        if (!config) {
          throw new Error(`Telegram config not found for provider ${provider.id}`);
        }
        return { ...provider, ...config, type: NotificationProviderType.TELEGRAM as const };
      }

      throw new Error(`Unknown provider type: ${provider.type}`);
    }),
  );

  return { providers: providersWithConfigs, total };
}

/**
 * Insert a new notification provider.
 *
 * @param notificationProvider - The notification provider to insert.
 * @returns The inserted notification provider. If the notification provider could not be inserted, an error is thrown.
 */
export async function insertNotificationProvider(notificationProvider: z.infer<typeof insertNotificationProviderSchema>) {
  const insertedNotificationProviders = await db.insert(NotificationProviders).values(notificationProvider).returning();
  const insertedNotificationProvider = insertedNotificationProviders[0];

  if (!insertedNotificationProvider) {
    throw new Error("Failed to insert notification provider");
  }

  return insertedNotificationProvider;
}

/**
 * Update a notification provider.
 *
 * @param id - The id of the notification provider.
 * @param notificationProvider - The notification provider to update.
 * @returns The updated notification provider. If the notification provider could not be updated, an error is thrown.
 */
export async function updateNotificationProvider(id: string, notificationProvider: z.infer<typeof updateNotificationProviderSchema>) {
  const updatedNotificationProviders = await db.update(NotificationProviders).set(notificationProvider).where(eq(NotificationProviders.id, id)).returning();
  const updatedNotificationProvider = updatedNotificationProviders[0];

  if (!updatedNotificationProvider) {
    throw new Error("Failed to update notification provider");
  }

  return updatedNotificationProvider;
}

/**
 * Delete a notification provider by its ID.
 *
 * @param id - The id of the notification provider.
 * @returns The deleted notification provider. If the notification provider could not be deleted, an error is thrown.
 */
export async function deleteNotificationProviderById(id: string) {
  const deletedNotificationProviders = await db.delete(NotificationProviders).where(eq(NotificationProviders.id, id)).returning();
  const deletedNotificationProvider = deletedNotificationProviders[0];

  if (!deletedNotificationProvider) {
    throw new Error("Failed to delete notification provider");
  }

  return deletedNotificationProvider;
}
