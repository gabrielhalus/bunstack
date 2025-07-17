import type { Role } from "schemas/roles";

import type { User } from "./schemas/users";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in string]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>
  }>
};

type Permissions = {
  users: {
    dataType: User;
    action: "view" | "create" | "update" | "delete";
  };
  roles: {
    dataType: Role;
    action: "view" | "create" | "update" | "delete";
  };
};

const ROLES = {
  admin: {
    users: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    roles: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  manager: {
    users: {
      view: true,
    },
    roles: {
      view: true,
    },
  },
  user: {
    users: {
      view: (user, resource) => user.id === resource.id,
      update: (user, resource) => user.id === resource.id,
      delete: (user, resource) => user.id === resource.id,
    },
    roles: {
      view: (user, resource) => user.roles.some(({ id }) => id === resource.id),
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  return user.roles.some(({ id }: { id: string }) => {
    const permission = (ROLES as RolesWithPermissions)[id][resource]?.[action];
    if (permission == null)
      return false;

    if (typeof permission === "boolean")
      return permission;
    return data != null && permission(user, data);
  });
};
