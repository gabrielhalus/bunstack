import type { User } from "@/types/users";
import type { Permission } from "@/types/permissions";
import type { Merge } from "@/lib/utils";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { Roles } from "@/schemas/roles";

export type Role = typeof Roles.$inferSelect;

export type RoleWithMembersCount = Merge<Role, { members: number }>;

export type RoleWithMembers = Merge<Role, { members: User[] }>;

export type RoleWithPermissions = Merge<Role, { permissions: Permission[] }>;

export const insertRoleSchema = createInsertSchema(Roles, {
  id: z.never(),
});

export const updateRoleInputSchema = z.object({
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
});

