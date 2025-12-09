import type { Permission } from "@/types/permissions";

import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { Roles } from "@/schemas/roles";

export const Policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  effect: text("effect").$type<"allow" | "deny">().notNull(),
  permission: text("permission").$type<Permission>(),
  roleId: integer("role_id").references(() => Roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  condition: text("condition"),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

