import type { RoleTranslations } from "../schemas/role-translations";

export type RolePermission = typeof RoleTranslations.$inferSelect;
