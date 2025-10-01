import type { Permission } from "@bunstack/shared/access/types";

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { Roles } from "@bunstack/shared/database/schemas/roles";

export const Policies = sqliteTable("policies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  effect: text("effect", { enum: ["allow", "deny"] }).notNull(),
  permission: text("permission").$type<Permission>(),
  roleId: integer("role_id").references(() => Roles.id),
  condition: text("condition"),
  description: text("description"),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});
