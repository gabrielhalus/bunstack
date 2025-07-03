import type { Role } from "schemas";
import type { UserProfile, UserWithRoles } from "schemas/users/types";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: UserWithRoles, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>
  }>
};

type Permissions = {
  users: {
    dataType: UserProfile;
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
  user: UserWithRoles,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];
    if (permission == null)
      return false;

    if (typeof permission === "boolean")
      return permission;
    return data != null && permission(user, data);
  });
};
