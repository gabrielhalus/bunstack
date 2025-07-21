import type { User } from "@bunstack/shared/schemas/users";

import { getUser } from "@bunstack/shared/db/queries/users";
import env from "@bunstack/shared/env";
import { createFactory } from "hono/factory";
import { verify } from "hono/jwt";

type Env = {
  Variables: {
    user: User;
  };
};

const factory = createFactory<Env>();

/**
 * Get the user from the JWT token
 * @param c - The context
 * @param next - The next middleware
 * @returns The user
 */
export const getAuth = factory.createMiddleware(async (c, next) => {
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

  const user = await getUser("id", decoded.sub as string);

  if (!user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const { password: _, ...User } = user;
  c.set("user", User);

  await next();
});
