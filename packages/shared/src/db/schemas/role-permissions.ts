import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Permission } from "../../access/types";

import { Roles } from "./roles";

export const RolePermissions = sqliteTable("role_permissions", {
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  permission: text("permission").notNull().$type<Permission>(),
}, table => [
  primaryKey({ columns: [table.roleId, table.permission] }),
]);
