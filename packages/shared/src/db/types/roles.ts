import type { Merge } from "../../types/utils";
import type { Roles } from "../schemas/roles";
import type { User } from "./users";

export type Role = typeof Roles.$inferSelect;

export type RoleWithMembersCount = Merge<Role, { members: number }>;

export type RoleWithMembers = Merge<Role, { members: User[] }>;

export type RoleUniqueFields = Pick<Role, "id" | "name">;

export type RoleOrderBy = keyof Role | { field: keyof Role; direction: "asc" | "desc" };
