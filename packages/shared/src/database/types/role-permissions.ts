import type { RolePermissions } from "@bunstack/shared/database/schemas/role-permissions";

export type RolePermission = typeof RolePermissions.$inferSelect;
