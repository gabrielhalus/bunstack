import { pgTable, text } from "drizzle-orm/pg-core";

import { NotificationProviders } from "@/schemas/notification-providers";

export const Telegram = pgTable("telegram", {
  providerId: text("provider_id").primaryKey().references(() => NotificationProviders.id, { onDelete: "cascade", onUpdate: "cascade" }),
  botToken: text("bot_token").notNull(),
  chatId: text("chat_id").notNull(),
  threadId: text("thread_id"),
});
