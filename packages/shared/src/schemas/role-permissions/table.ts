import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";

import { permissionsTable } from "../permissions";
import { rolesTable } from "../roles";

export const rolePermissions = sqliteTable("role_permissions", {
  roleId: integer("role_id").notNull().references(() => rolesTable.id),
  permissionId: integer("permission_id").notNull().references(() => permissionsTable.id),
}, table => [
  primaryKey({ columns: [table.roleId, table.permissionId] }),
]);
