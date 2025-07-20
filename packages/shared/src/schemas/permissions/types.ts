import type { Permissions } from "./table";

export type Permission = typeof Permissions.$inferSelect;

export type PermissionUniqueFields = Pick<Permission, "id" | "name">;
