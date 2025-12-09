import type { NotificationProviderOrderBy } from "@bunstack/shared/types/notification-providers";

import { Hono } from "hono";

import { requirePermission } from "../../middlewares/access-control";
import { getAuthContext } from "../../middlewares/auth";
import { validationMiddleware } from "../../middlewares/validation";
import { discordRoutes } from "./discord";
import { telegramRoutes } from "./telegram";
import { paginationInputSchema } from "@bunstack/shared/contracts/pagination";
import { getNotificationProviders } from "@bunstack/db/queries/notification-providers";

export const notificationsRoutes = new Hono()
  // --- All routes below this point require authentication
  .use(getAuthContext)

  .get("/providers", requirePermission("notification:list"), validationMiddleware("query", paginationInputSchema), async (c) => {
    try {
      const { page, pageSize, search, sortField, sortDirection } = c.req.valid("query");

      const orderBy = sortField ? { field: sortField as keyof NotificationProviderOrderBy, direction: sortDirection } : undefined;
      const { providers, total } = await getNotificationProviders(page, pageSize, orderBy, search);

      return c.json({ success: true as const, providers, total });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .route("/discord", discordRoutes)
  .route("/telegram", telegramRoutes);
