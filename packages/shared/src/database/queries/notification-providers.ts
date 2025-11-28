import type { OrderBy } from "../../types/pagination";
import type { NotificationProvider } from "../types/notification-providers";

import { asc, count, desc, like, or } from "drizzle-orm";

import { db } from "..";
import { NotificationProviders } from "../schemas/notification-providers";

/**
 * Retrieves a paginated list of notification providers, each including their associated roles.
 *
 * @param page - The page number to retrieve (1-based).
 * @param limit - The number of notification providers to retrieve per page.
 * @param orderBy - Optional ordering criteria for the notification provider.
 * @param search - Optional search term to filter by name or email.
 * @returns An object containing an array of notification providers with their roles and the total number of notification providers.
 */
export async function getNotificationProviders(page: number, limit: number, orderBy?: OrderBy<NotificationProvider>, search?: string): Promise<{ providers: Array<NotificationProvider>; total: number }> {
  const offset = (page) * limit;

  // Build search conditions
  const searchConditions = search ? or(like(NotificationProviders.name, `%${search}%`), like(NotificationProviders.description, `%${search}%`)) : undefined;

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

  return { providers, total };
}
