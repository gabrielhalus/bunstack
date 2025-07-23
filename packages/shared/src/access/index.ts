import { and, eq, inArray, isNull, or } from "drizzle-orm";

import type { Condition } from "db/types/policies";

import type { PermissionCheck } from "./types";

import { db } from "../db";
import { Permissions } from "../db/schemas/permissions";
import { Policies } from "../db/schemas/policies";
import { evaluateCondition } from "./evalutate-condition";

export async function can({
  permissionName,
  user,
  roles,
  resource,
}: PermissionCheck): Promise<boolean> {
  if (roles.some(r => r.isSuperAdmin)) {
    return true;
  }

  const permission = await db.query.permissions.findFirst({
    where: eq(Permissions.name, permissionName),
  });

  if (!permission) {
    return false;
  }

  const roleIds = roles.map(r => r.id);

  const applicablePolicies = await db
    .select()
    .from(Policies)
    .where(
      and(
        or(eq(Policies.permissionId, permission.id), isNull(Policies.permissionId)),
        or(inArray(Policies.roleId, roleIds), isNull(Policies.roleId)),
      ),
    );

  for (const policy of applicablePolicies) {
    const allow = policy.effect === "allow";
    const conditionOk = policy.condition
      ? evaluateCondition(JSON.parse(policy.condition) as Condition, user, resource)
      : true;

    if (conditionOk) {
      return allow;
    }
  }

  return false;
}
