import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  index: integer("index").notNull().unique(),
  isDefault: boolean("is_default").notNull().default(false),
  isSuperAdmin: boolean("is_super_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
