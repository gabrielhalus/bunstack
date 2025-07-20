import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rolesTable = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  level: integer("level").notNull(),
  isDefault: integer("is_default").notNull().default(0),
  isSuperAdmin: integer("is_super_admin").notNull().default(0),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});
