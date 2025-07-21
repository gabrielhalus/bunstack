import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";

import { Permissions } from "./permissions";
import { Roles } from "./roles";

export const RolesToPermissions = sqliteTable("role_permissions", {
  roleId: integer("role_id").notNull().references(() => Roles.id),
  permissionId: integer("permission_id").notNull().references(() => Permissions.id),
}, table => [
  primaryKey({ columns: [table.roleId, table.permissionId] }),
]);
