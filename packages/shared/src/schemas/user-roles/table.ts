import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { rolesTable } from "../roles";
import { usersTable } from "../users";

export const userRolesTable = sqliteTable("user_roles", {
  userId: text("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  roleId: text("role_id").references(() => rolesTable.id, { onDelete: "cascade" }),
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
]);
