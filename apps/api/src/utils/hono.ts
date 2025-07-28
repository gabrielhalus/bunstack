import type { Permission, Policy } from "@bunstack/shared/access/types";
import type { Role } from "@bunstack/shared/db/types/roles";
import type { User } from "@bunstack/shared/db/types/users";
import type { Context } from "hono";

import { createFactory } from "hono/factory";

export type AppEnv = {
  Variables: {
    authContext: {
      user: User;
      roles: Role[];
      permissions: Permission[];
      policies: Policy[];
    };
  };
};

export const factory = createFactory<AppEnv>();

export type AppContext = Context<AppEnv, string, object>;
