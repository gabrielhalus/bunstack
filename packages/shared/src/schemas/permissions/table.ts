import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const permissionsTable = sqliteTable("permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});
