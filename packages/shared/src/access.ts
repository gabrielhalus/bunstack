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
  settings: {
    dataType: null;
    action: "view" | "update";
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
    settings: {
      view: true,
      update: true,
    },
  },
  manager: {
    users: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  user: {
    users: {
      view: (user, resource) => user.id === resource.id,
      update: (user, resource) => user.id === resource.id,
      delete: (user, resource) => user.id === resource.id,
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
