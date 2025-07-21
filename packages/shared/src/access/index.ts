import { and, eq, inArray, isNull, or } from "drizzle-orm";

import type { PermissionCheck, UserContext, UserLike, ResourceContext } from "./types";

import { db } from "../db";
import { Permissions } from "../schemas/permissions";
import { Policies } from "../schemas/policies";
import { evaluateCondition } from "./evalutate-condition";

// Add a helper function to normalize user objects
export function normalizeUserContext(user: UserLike): UserContext {
  return {
    id: user.id,
    roles: user.roles || [],
    attributes: user.attributes || {},
  };
}

export async function can({
  permissionName,
  user,
  resource,
}: PermissionCheck): Promise<boolean> {
  const permission = await db.query.permissions.findFirst({
    where: eq(Permissions.name, permissionName),
  });

  if (!permission) {
    return false;
  }

  const roleIds = user.roles.map(r => r.id);

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
      ? evaluateCondition(policy.condition, user, resource)
      : true;

    if (conditionOk) {
      return allow;
    }
  }

  return false;
}

// Add a new function that accepts UserLike and normalizes it
export async function canWithUserLike(
  permissionName: string,
  user: UserLike,
  resource?: ResourceContext
): Promise<boolean> {
  const normalizedUser = normalizeUserContext(user);
  return can({ permissionName, user: normalizedUser, resource });
}
