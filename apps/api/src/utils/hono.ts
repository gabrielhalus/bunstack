import type { Context } from "hono";

import { createFactory } from "hono/factory";

import type { Policy, RoleContext, UserContext } from "@bunstack/shared/access/types";

export type AppEnv = {
  Variables: {
    authContext: {
      user: UserContext;
      roles: RoleContext[];
      policies: Policy[];
    };
  };
};

export const factory = createFactory<AppEnv>();

export type AppContext = Context<AppEnv, string, object>;
