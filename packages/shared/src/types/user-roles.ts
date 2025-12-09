import type { UserRoles } from "@/schemas/user-roles";

export type UserRole = typeof UserRoles.$inferSelect;

