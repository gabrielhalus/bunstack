import type { rolesTable } from "./table";

export type Role = typeof rolesTable.$inferSelect;

export type RoleUniqueFields = Pick<Role, "id" | "sortOrder" | "isDefault">;
