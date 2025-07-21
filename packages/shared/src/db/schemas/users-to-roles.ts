import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { Roles } from "./roles";
import { Users } from "./users";

export const UsersToRoles = sqliteTable("user_roles", {
  userId: text("user_id").references(() => Users.id, { onDelete: "cascade" }),
  roleId: text("role_id").references(() => Roles.id, { onDelete: "cascade" }),
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
]);
