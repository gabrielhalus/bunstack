import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { permissionsTable } from "../permissions";
import { rolesTable } from "../roles";

export const policies = sqliteTable("policies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  effect: text("effect", { enum: ["allow", "deny"] }).notNull(),
  permissionId: integer("permission_id").references(() => permissionsTable.id),
  roleId: integer("role_id").references(() => rolesTable.id),
  condition: text("condition"), // e.g. JSON expression string
  description: text("description"),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});
