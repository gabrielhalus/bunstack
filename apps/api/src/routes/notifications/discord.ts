import { Hono } from "hono";

import { requirePermission } from "@bunstack/api/middlewares/access-control";
import { validationMiddleware } from "@bunstack/api/middlewares/validation";
import { insertDiscord, updateDiscord } from "@bunstack/db/queries/discord";
import { deleteNotificationProviderById, insertNotificationProvider, updateNotificationProvider } from "@bunstack/db/queries/notification-providers";
import { discordSchema } from "@bunstack/shared/types/discord";
import { insertDiscordProviderSchema, NotificationProviderType, updateDiscordProviderSchema } from "@bunstack/shared/types/notification-providers";

export const discordRoutes = new Hono()
  .post("/", requirePermission("notification:create"), validationMiddleware("json", insertDiscordProviderSchema), async (c) => {
    try {
      const { name, webhookUrl, decorations } = c.req.valid("json");

      const notificationProvider = await insertNotificationProvider({ name, type: NotificationProviderType.DISCORD });
      if (!notificationProvider) {
        return c.json({ success: false as const, error: "Failed to create notification provider" }, 500);
      }

      const discord = await insertDiscord(notificationProvider.id, { webhookUrl, decorations });
      if (!discord) {
        return c.json({ success: false as const, error: "Failed to create discord record" }, 500);
      }

      return c.json({ success: true as const, data: { notificationProvider, discord } });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .put("/:id", requirePermission("notification:update"), validationMiddleware("json", updateDiscordProviderSchema), async (c) => {
    try {
      const { id } = c.req.param();
      const { name, webhookUrl, decorations } = c.req.valid("json");

      const notificationProvider = await updateNotificationProvider(id, { name });
      if (!notificationProvider) {
        return c.json({ success: false as const, error: "Failed to update notification provider" }, 500);
      }

      const discord = await updateDiscord(notificationProvider.id, { webhookUrl, decorations });
      if (!discord) {
        return c.json({ success: false as const, error: "Failed to update discord record" }, 500);
      }

      return c.json({ success: true as const, data: { notificationProvider, discord } });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .delete("/:id", requirePermission("notification:delete"), async (c) => {
    try {
      const { id } = c.req.param();

      await deleteNotificationProviderById(id);

      return c.json({ success: true as const });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .post("/test", validationMiddleware("json", discordSchema), async (c) => {
    try {
      const { webhookUrl, decorations } = c.req.valid("json");

      const body = {
        content: decorations ? null : "Hi from Bunstack 👋",
        embeds: decorations
          ? [
              {
                title: "Test Notification",
                description: "Hi from Bunstack 👋",
                color: 5814783,
              },
            ]
          : undefined,
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        return c.json({ success: false as const, error: "Failed to test notification" }, 500);
      }

      return c.json({ success: true as const });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
