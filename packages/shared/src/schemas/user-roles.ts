import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { Roles } from "@/schemas/roles";
import { Users } from "@/schemas/users";

export const UserRoles = pgTable("user_roles", {
  userId: text("user_id").notNull().references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  roleId: integer("role_id").notNull().references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, table => [
  primaryKey({ columns: [table.userId, table.roleId] }),
]);

