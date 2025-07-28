import type { Policy, RoleContext, UserContext } from "./types";

import { evaluateCondition } from "./evalutate-condition";

export function can(permission: string, user: UserContext, roles: RoleContext[], policies: Policy[], resource?: Record<string, unknown>): boolean {
  if (roles.some(r => r.isSuperAdmin)) {
    return true;
  }

  const relevantPolicies = policies.filter(p =>
    (p.permission === null || p.permission === permission)
    && (p.roleId === null || roles.some(r => r.id === p.roleId)),
  );

  if (!relevantPolicies.length) {
    return true;
  }

  for (const policy of relevantPolicies) {
    const allowed = policy.effect === "allow";
    const validCondition = policy.condition
      ? evaluateCondition(policy.condition, user, resource)
      : true;

    if (validCondition) {
      return allowed;
    }
  }

  return false;
}
