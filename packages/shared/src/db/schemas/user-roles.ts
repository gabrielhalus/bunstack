import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { Roles } from "./roles";
import { Users } from "./users";

export const UserRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull().references(() => Users.id, { onDelete: "cascade" }),
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade" }),
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
]);
