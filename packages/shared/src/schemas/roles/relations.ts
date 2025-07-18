import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { permissionsTable } from "../permissions/table";
import { rolesTable } from "./table";

export const rolePermissionsTable = sqliteTable("role_permissions", {
  roleId: text("role_name").notNull().references(() => rolesTable.id, { onDelete: "cascade" }),
  resource: text("resource").notNull(),
  action: text("action").notNull().references(() => permissionsTable.name, { onDelete: "cascade" }),
  condition: text("condition"),
}, table => [
  primaryKey({ columns: [table.roleId, table.resource, table.action] }),
]);
