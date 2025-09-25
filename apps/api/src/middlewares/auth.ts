import { Constants } from "@bunstack/shared/constants";
import { getUserWithContext } from "@bunstack/shared/db/queries/users";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { env } from "@bunstack/api/lib/env";
import { factory } from "@bunstack/api/utils/hono";

/**
 * Get the user from the JWT token and set the auth context
 * @param c - The context
 * @param next - The next middleware
 * @returns The user
 */
export const getAuthContext = factory.createMiddleware(async (c, next) => {
  const accessToken = getCookie(c, Constants.accessToken);

  if (!accessToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let decoded;
  try {
    decoded = await verify(accessToken, env.JWT_SECRET);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { user, ...context } = await getUserWithContext("id", decoded.sub as string);

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("authContext", { user, ...context });

  await next();
});
