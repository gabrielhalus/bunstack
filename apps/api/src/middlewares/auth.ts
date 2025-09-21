import { getUserWithContext } from "@bunstack/shared/db/queries/users";
import env from "@bunstack/shared/env";
import { verify } from "hono/jwt";

import { factory } from "@/utils/hono";

/**
 * Get the user from the JWT token and set the auth context
 * @param c - The context
 * @param next - The next middleware
 * @returns The user
 */
export const getAuthContext = factory.createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let decoded;
  try {
    decoded = await verify(token, env.JWT_SECRET);
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
