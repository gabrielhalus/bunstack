import { Hono } from "hono";

import { requirePermission } from "@bunstack/api/middlewares/access-control";
import { validationMiddleware } from "@bunstack/api/middlewares/validation";
import { deleteNotificationProviderById, insertNotificationProvider, updateNotificationProvider } from "@bunstack/db/queries/notification-providers";
import { insertTelegram, updateTelegram } from "@bunstack/db/queries/telegram";
import { insertTelegramProviderSchema, NotificationProviderType, updateTelegramProviderSchema } from "@bunstack/shared/types/notification-providers";
import { telegramSchema } from "@bunstack/shared/types/telegram";

export const telegramRoutes = new Hono()
  .post("/", requirePermission("notification:create"), validationMiddleware("json", insertTelegramProviderSchema), async (c) => {
    try {
      const { name, botToken, chatId, threadId } = c.req.valid("json");

      const notificationProvider = await insertNotificationProvider({ name, type: NotificationProviderType.TELEGRAM });
      if (!notificationProvider) {
        return c.json({ success: false as const, error: "Failed to create notification provider" }, 500);
      }

      const telegram = await insertTelegram(notificationProvider.id, { botToken, chatId, threadId });
      if (!telegram) {
        return c.json({ success: false as const, error: "Failed to create telegram record" }, 500);
      }

      return c.json({ success: true as const });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .put("/:id", requirePermission("notification:update"), validationMiddleware("json", updateTelegramProviderSchema), async (c) => {
    try {
      const { id } = c.req.param();
      const { name, botToken, chatId, threadId } = c.req.valid("json");

      const notificationProvider = await updateNotificationProvider(id, { name });
      if (!notificationProvider) {
        return c.json({ success: false as const, error: "Failed to update notification provider" }, 500);
      }

      const telegram = await updateTelegram(notificationProvider.id, { botToken, chatId, threadId });
      if (!telegram) {
        return c.json({ success: false as const, error: "Failed to update telegram record" }, 500);
      }

      return c.json({ success: true as const, data: { notificationProvider, telegram } });
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

  .post("/test", requirePermission("notification:create"), validationMiddleware("json", telegramSchema), async (c) => {
    try {
      const { botToken, chatId, threadId } = c.req.valid("json");

      const body = {
        chat_id: chatId,
        text: "Hi from Bunstack 👋",
        message_thread_id: threadId,
      };

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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
