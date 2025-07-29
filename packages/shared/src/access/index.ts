import type { Permission, Policy, RoleContext, UserContext } from "./types";

import { evaluateCondition } from "./evalutate-condition";

export function can(permission: Permission, user: UserContext, roles: RoleContext[], policies: Policy[], resource?: Record<string, unknown>): boolean {
  if (roles.some(r => r.isSuperAdmin)) {
    return true;
  }

  const sortedRoles = [...roles].sort((a, b) => b.level - a.level);

  for (const role of sortedRoles) {
    // Get policies for this role and permission (or global)
    const rolePolicies = policies.filter(p =>
      (p.permission === null || p.permission === permission)
      && (p.roleId === null || p.roleId === role.id),
    );

    if (!rolePolicies.length) {
      return role.permissions.includes(permission);
    }

    for (const policy of rolePolicies) {
      const validCondition = policy.condition
        ? evaluateCondition(policy.condition, user, resource)
        : true;

      if (!validCondition) {
        continue;
      }

      return policy.effect === "allow";
    }
  }

  return false;
}
