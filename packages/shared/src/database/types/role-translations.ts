import type { RoleTranslations } from "@bunstack/shared/database/schemas/role-translations";

export type RolePermission = typeof RoleTranslations.$inferSelect;
