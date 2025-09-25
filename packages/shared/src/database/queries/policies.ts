import type { Permission } from "@bunstack/shared/access/types";
import type { Policy } from "@bunstack/shared/database/types/policies";

import { db } from "@bunstack/shared/database";
import { Policies } from "@bunstack/shared/database/schemas/policies";
import { and, eq, isNull, or } from "drizzle-orm";

export async function getApplicablePolicies(roleId?: number, permission?: Permission, effect?: Policy["effect"]): Promise<Policy[]> {
  const conditions = [];

  // Match roleId or global (null)
  if (roleId !== undefined) {
    conditions.push(or(eq(Policies.roleId, roleId), isNull(Policies.roleId)));
  }

  // Match permission or wildcard (null)
  if (permission !== undefined) {
    conditions.push(or(eq(Policies.permission, permission), isNull(Policies.permission)));
  }

  if (effect !== undefined) {
    conditions.push(eq(Policies.effect, effect));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return await db.select().from(Policies).where(whereClause).all();
}
