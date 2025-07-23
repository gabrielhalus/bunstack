import type { Role } from "db/types/roles";
import type { User } from "db/types/users";

export type PermissionCheck = {
  permissionName: string;
  user: User;
  roles: Role[];
  resource?: ResourceContext;
};

export type ResourceContext = {
  type: string;
  [key: string]: any;
};
