import type { Permissions } from "../schemas/permissions";

export type Permission = typeof Permissions.$inferSelect;
