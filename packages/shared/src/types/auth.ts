import type { Permission, Policy } from "@bunstack/shared/access/types";
import type { RoleWithPermissions } from "@bunstack/shared/database/types/roles";
import type { User } from "@bunstack/shared/database/types/users";

export type AuthResult = {
  user: User;
  roles: RoleWithPermissions[];
  policies: Policy[];
  isAdmin: boolean;
  isAuthenticated: true;
  can: (permission: Permission, resource?: Record<string, unknown>) => boolean;
};
