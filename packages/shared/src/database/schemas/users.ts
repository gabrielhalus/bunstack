import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { nanoid } from "../../lib/nanoid";

export const Users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  verifiedAt: timestamp("verified_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});
