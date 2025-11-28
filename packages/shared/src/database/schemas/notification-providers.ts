import { boolean, json, pgTable, text } from "drizzle-orm/pg-core";

import { nanoid } from "../../lib/nanoid";

export const NotificationProviders = pgTable("notification_providers", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type", { enum: ["SMTP", "DISCORD", "TELEGRAM"] }).notNull().default("SMTP"),
  config: json("config").notNull().default({}),
  enabled: boolean("enabled").notNull().default(true),
});
