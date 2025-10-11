import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { nanoid } from "../../lib/nanoid";

export const Tokens = pgTable("tokens", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  userId: text("user_id").notNull(),
  issuedAt: timestamp("issued_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  userAgent: text("user_agent"),
  ip: text("ip"),
});
