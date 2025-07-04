import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { ROLES } from "./types";

export const userRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull(),
  role: text("role", { enum: ROLES }).notNull().default("user"),
}, table => [
  primaryKey({ columns: [table.userId, table.role] }),
]);
