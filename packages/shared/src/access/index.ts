import type { User } from "schemas/users";

import { policies } from "./policies";

/**
 * Checks if a user has access to a resource and action.
 *
 * @returns true if the user has access to the resource and action, false otherwise.
 *
 * @example
 * const hasAccess = can(user, 'users', 'update', targetUser);
 */
export function can(user: User, resource: string, action: string, resourceInstance?: any) {
  if (user.roles.some(r => r.isAdmin)) {
    return true;
  }

  const relevant = user.permissions.filter(p => p.resource === resource && p.action === action);

  for (const perm of relevant) {
    if (!perm.condition) {
      return true;
    }

    const policy = policies[perm.condition];

    if (policy && policy(user, resourceInstance, perm.conditionArgs)) {
      return true;
    }
  }

  return false;
}
