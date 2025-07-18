import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const permissionsTable = sqliteTable("permissions", {
  name: text("name").primaryKey(),
  description: text("description"),
});
