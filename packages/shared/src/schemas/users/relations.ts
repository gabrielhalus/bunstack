import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull(),
  role: text("role_id").notNull(),
}, table => [
  primaryKey({ columns: [table.userId, table.role] }),
]);
