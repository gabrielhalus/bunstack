import { Permissions } from "./permissions";
import { Policies } from "./policies";
import { RolePermissions } from "./role-permissions";
import { Roles } from "./roles";
import { Tokens } from "./tokens";
import { UserRoles } from "./user-roles";
import { Users } from "./users";

export const schema = {
  permissions: Permissions,
  policies: Policies,
  rolePermissions: RolePermissions,
  roles: Roles,
  tokens: Tokens,
  userRoles: UserRoles,
  users: Users,
};
