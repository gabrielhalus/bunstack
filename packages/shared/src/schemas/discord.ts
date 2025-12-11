import { boolean, pgTable, text } from "drizzle-orm/pg-core";

import { NotificationProviders } from "@/schemas/notification-providers";

export const Discord = pgTable("discord", {
  providerId: text("provider_id").primaryKey().references(() => NotificationProviders.id, { onDelete: "cascade", onUpdate: "cascade" }),
  webhookUrl: text("webhook_url").notNull(),
  decorations: boolean("decorations").notNull(),
});
