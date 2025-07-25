import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";

import { Permissions } from "./permissions";
import { Roles } from "./roles";

export const RolePermissions = sqliteTable("role_permissions", {
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  permissionId: integer("permission_id").notNull().references(() => Permissions.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, table => [
  primaryKey({ columns: [table.roleId, table.permissionId] }),
]);
