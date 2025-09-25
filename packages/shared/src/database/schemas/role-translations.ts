import { Roles } from "@bunstack/shared/database/schemas/roles";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const RoleTranslations = sqliteTable("role_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  locale: text("locale", { enum: ["fr", "en"] }).notNull(),
  field: text("field").notNull(),
  value: text("value").notNull(),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});
