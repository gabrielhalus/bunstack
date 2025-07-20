import type { permissionsTable } from "./table";

export type Permission = typeof permissionsTable.$inferSelect;

export type PermissionUniqueFields = Pick<Permission, "id" | "name">;
