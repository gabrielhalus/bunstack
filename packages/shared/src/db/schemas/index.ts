import { Permissions } from "./permissions";
import { Policies } from "./policies";
import { RolesToPermissions } from "./roles-to-permissions";
import { Roles } from "./roles";
import { Tokens } from "./tokens";
import { UsersToRoles } from "./users-to-roles";
import { Users } from "./users";

export const schema = {
  permissions: Permissions,
  policies: Policies,
  rolesToPermissions: RolesToPermissions,
  roles: Roles,
  tokens: Tokens,
  usersToRoles: UsersToRoles,
  users: Users,
};
