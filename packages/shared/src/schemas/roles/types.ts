import type { Roles } from "./table";

export type Role = typeof Roles.$inferSelect;

export type RoleUniqueFields = Pick<Role, "id" | "name">;
