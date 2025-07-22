import type { Roles } from "../schemas/roles";

export type Role = typeof Roles.$inferSelect;

export type RoleUniqueFields = Pick<Role, "id" | "name">;
