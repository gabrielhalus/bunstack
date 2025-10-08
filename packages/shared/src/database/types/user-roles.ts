import type { UserRoles } from "@bunstack/shared/database/schemas/user-roles";

export type UserRole = typeof UserRoles.$inferSelect;
