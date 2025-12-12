import type { Policy, Role, User } from "@bunstack/auth/types";
import type { Context } from "hono";

import { createFactory } from "hono/factory";

export type AppEnv = {
  Variables: {
    authContext: {
      user: User;
      roles: Role[];
      policies: Policy[];
    };
  };
};

export const factory = createFactory<AppEnv>();

export type AppContext = Context<AppEnv, string, object>;
