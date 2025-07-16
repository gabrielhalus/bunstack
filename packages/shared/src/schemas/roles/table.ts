import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const rolesTable = sqliteTable("roles", {
  name: text("name").primaryKey(),
  label: text("label").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  isSuperUser: integer("is_super_user", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
}, t => [
  uniqueIndex("sort_order_unique").on(t.sortOrder),
  uniqueIndex("is_default_unique").on(t.isDefault).where(sql`"is_default" = 1`),
]);
