import type { Role } from "@bunstack/shared/db/types/roles";
import type { User } from "@bunstack/shared/db/types/users";

import { getUserWithContext } from "@bunstack/shared/db/queries/users";
import env from "@bunstack/shared/env";
import { createFactory } from "hono/factory";
import { verify } from "hono/jwt";

type Env = {
  Variables: {
    authContext: {
      user: User;
      roles: Role[];
      permissions: string[];
    };
  };
};

const factory = createFactory<Env>();

/**
 * Get the user from the JWT token and set the auth context
 * @param c - The context
 * @param next - The next middleware
 * @returns The user
 */
export const getAuthContext = factory.createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  let decoded;
  try {
    decoded = await verify(token, env.JWT_SECRET);
  } catch {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const { user, ...context } = await getUserWithContext("id", decoded.sub as string);

  if (!user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  c.set("authContext", { user, ...context });

  await next();
});
