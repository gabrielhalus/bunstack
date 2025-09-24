import type { RoleTranslations } from "@bunstack/shared/db/schemas/role-translations";

export type RolePermission = typeof RoleTranslations.$inferSelect;
