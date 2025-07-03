import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ROLES = ["admin", "user"] as const;

export type Role = (typeof ROLES)[number];

export const userRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull(),
  role: text("role", { enum: ROLES }).notNull().default("user"),
});
