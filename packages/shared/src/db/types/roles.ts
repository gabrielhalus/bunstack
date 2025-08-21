import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type { Permission } from "../../access/types";
import type { Merge } from "../../types/utils";
import type { User } from "./users";

import { Roles } from "../schemas/roles";

export type Role = typeof Roles.$inferSelect;

export type RoleWithMembersCount = Merge<Role, { members: number }>;

export type RoleWithMembers = Merge<Role, { members: User[] }>;

export type RoleUniqueFields = Pick<Role, "id" | "level" | "name">;

export type RoleWithPermissions = Merge<Role, { permissions: Permission[] }>;

export type RoleOrderBy = keyof Role | { field: keyof Role; direction: "asc" | "desc" };

export const insertRoleSchema = createInsertSchema(Roles, {
  id: z.never(),
});

export const updateRoleSchema = z.object({
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
});

export const updateRoleLevelSchema = z.object({
  level: z.number().gt(0),
});
