import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const rolesTable = sqliteTable("roles", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
}, t => [
  uniqueIndex("sort_order_unique").on(t.sortOrder),
  uniqueIndex("is_default_unique").on(t.isDefault).where(sql`"is_default" = 1`),
]);
