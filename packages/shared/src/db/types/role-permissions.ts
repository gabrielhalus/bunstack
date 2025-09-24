import type { RolePermissions } from "@bunstack/shared/db/schemas/role-permissions";

export type RolePermission = typeof RolePermissions.$inferSelect;
