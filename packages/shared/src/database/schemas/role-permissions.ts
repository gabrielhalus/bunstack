import type { Permission } from "@bunstack/shared/access/types";

import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { Roles } from "@bunstack/shared/database/schemas/roles";

export const RolePermissions = sqliteTable("role_permissions", {
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  permission: text("permission").notNull().$type<Permission>(),
}, table => [
  primaryKey({ columns: [table.roleId, table.permission] }),
]);
