import { Roles } from "@bunstack/shared/database/schemas/roles";
import { Users } from "@bunstack/shared/database/schemas/users";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull().references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
]);
