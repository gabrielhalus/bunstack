import type { UserRole } from "@bunstack/shared/database/types/user-roles";

import { and, eq } from "drizzle-orm";

import { db } from "@bunstack/shared/database";
import { UserRoles } from "@bunstack/shared/database/schemas/user-roles";

export async function assignUserRole(userRole: UserRole) {
  return await db.insert(UserRoles).values(userRole).returning().get();
}

export async function removeUserRole({ userId, roleId }: UserRole) {
  return await db.delete(UserRoles).where(and(eq(UserRoles.userId, userId), eq(UserRoles.roleId, roleId))).returning().get();
};
