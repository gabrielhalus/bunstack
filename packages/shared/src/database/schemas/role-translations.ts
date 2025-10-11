import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { Roles } from "./roles";

export const RoleTranslations = pgTable("role_translations", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  locale: text("locale").$type<"fr" | "en">().notNull(),
  field: text("field").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});
