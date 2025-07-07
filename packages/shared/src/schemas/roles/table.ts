import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const rolesTable = sqliteTable("roles", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  index: integer("index").notNull().default(0),
  default: integer("default", { mode: "boolean" }).notNull().default(false),
  superUser: integer("super_user", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
}, t => [
  uniqueIndex("name_unique").on(t.name),
  uniqueIndex("index_unique").on(t.index),
  uniqueIndex("default_unique").on(t.default).where(sql`"default" = 1`),
]);
