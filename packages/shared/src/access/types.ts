import type { User } from "../schemas/users";

export type PermissionEntry = {
  resource: string;
  action: string;
  condition?: string;
  conditionArgs?: Record<string, any>;
};

export type Policy = (
  user: User,
  resource: any,
  args?: Record<string, any>,
) => boolean;
