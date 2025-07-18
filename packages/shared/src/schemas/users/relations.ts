import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { rolesTable } from "../roles/table";
import { usersTable } from "./table";

export const userRolesTable = sqliteTable("user_roles", {
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => rolesTable.id, { onDelete: "cascade" }),
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
]);
