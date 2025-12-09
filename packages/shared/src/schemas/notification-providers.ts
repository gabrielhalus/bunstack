import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { nanoid } from "@/lib/nanoid";

export const NotificationProviders = pgTable("notification_providers", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  type: text("type", { enum: ["DISCORD", "TELEGRAM"] }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

