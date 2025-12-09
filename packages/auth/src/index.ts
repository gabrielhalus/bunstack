import type { Permission, Policy, RoleContext, UserContext } from "./types";

import { evaluateCondition } from "./evaluate-condition";

/**
 * Checks if a user has permission to perform an action.
 *
 * @param permission - The permission to check
 * @param user - The user context
 * @param roles - The user's roles with permissions
 * @param policies - The applicable policies
 * @param resource - Optional resource context for policy evaluation
 * @returns `true` if the user has permission, `false` otherwise
 */
export function can(permission: Permission, user: UserContext, roles: RoleContext[], policies: Policy[], resource?: Record<string, unknown>): boolean {
  // Super admins bypass all checks
  if (roles.some(r => r.isSuperAdmin)) {
    return true;
  }

  // Sort roles by index (descending) to check highest priority roles first
  const sortedRoles = [...roles].sort((a, b) => b.index - a.index);

  for (const role of sortedRoles) {
    // Get policies for this role and permission (or global policies)
    const rolePolicies = policies.filter(p =>
      (p.permission === null || p.permission === permission)
      && (p.roleId === null || p.roleId === role.id),
    );

    // If no policies exist for this role-permission combination
    if (!rolePolicies.length) {
      // Check if the role has the permission directly
      if (role.permissions.includes(permission)) {
        return true;
      }
      continue;
    }

    // Evaluate policies in order
    for (const policy of rolePolicies) {
      const validCondition = policy.condition
        ? evaluateCondition(policy.condition, user, resource)
        : true;

      if (!validCondition) {
        continue;
      }

      // First matching policy determines the result
      return policy.effect === "allow";
    }
  }

  return false;
}

// Re-export types for convenience
export type { Condition, Operand, Permission, Policy, RoleContext, UserContext } from "./types";

