import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Condition } from "../types/policies";

import { Permissions } from "./permissions";
import { Roles } from "./roles";

export const Policies = sqliteTable("policies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  effect: text("effect", { enum: ["allow", "deny"] }).notNull(),
  permissionId: integer("permission_id").references(() => Permissions.id),
  roleId: integer("role_id").references(() => Roles.id),
  condition: text("condition").$type<Condition>(),
  description: text("description"),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});
