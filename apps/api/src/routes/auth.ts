import { Constants } from "@bunstack/shared/constants";
import { availableSchema, loginInputSchema, registerInputSchema } from "@bunstack/shared/contracts/auth";
import { deleteToken, insertToken } from "@bunstack/shared/database/queries/tokens";
import { getUserExists, insertUser } from "@bunstack/shared/database/queries/users";
import { password } from "bun";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { getClientInfo } from "@bunstack/api/helpers/get-client-info";
import { createAccessToken, createRefreshToken, getCookieSettings, REFRESH_TOKEN_EXPIRATION_SECONDS, validateUser, verifyToken } from "@bunstack/api/lib/auth";
import { getAuthContext } from "@bunstack/api/middlewares/auth";
import { validationMiddleware } from "@bunstack/api/middlewares/validation";

export default new Hono()
  /**
   * Register a new user
   * @param c - The context
   * @returns The access token
   */
  .post("/register", validationMiddleware("json", registerInputSchema), async (c) => {
    const user = c.req.valid("json");
    const hashedPassword = await password.hash(user.password);

    try {
      const insertedUser = await insertUser({ ...user, password: hashedPassword });

      const insertedToken = await insertToken({
        userId: insertedUser.id,
        issuedAt: Date.now(),
        expiresAt: Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000,
      });

      const accessToken = await createAccessToken(insertedUser.id);
      setCookie(c, Constants.accessToken, accessToken, getCookieSettings("access"));

      const refreshToken = await createRefreshToken(insertedUser.id, insertedToken.id);
      setCookie(c, Constants.refreshToken, refreshToken, getCookieSettings("refresh"));

      return c.json({ success: true as const });
    } catch (error) {
      if (error instanceof Error && error.message.includes("UNIQUE constraint failed: users.email")) {
        return c.json({ success: false as const, error: "Email is already taken" }, 400);
      }

      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Login a user
   * @param c - The context
   * @returns The access token
   */
  .post("/login", validationMiddleware("json", loginInputSchema), async (c) => {
    const credentials = c.req.valid("json");

    try {
      const userId = await validateUser(credentials);
      if (!userId) {
        return c.json({ success: false as const, error: "Invalid credentials" }, 200);
      }

      const { userAgent, ip } = getClientInfo(c);

      const insertedToken = await insertToken({
        userId,
        issuedAt: Date.now(),
        expiresAt: Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000,
        userAgent,
        ip,
      });

      const accessToken = await createAccessToken(userId);
      setCookie(c, Constants.accessToken, accessToken, getCookieSettings("access"));

      const refreshToken = await createRefreshToken(userId, insertedToken.id);
      setCookie(c, Constants.refreshToken, refreshToken, getCookieSettings("refresh"));

      return c.json({ success: true as const });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Logout a user by clearing the refresh token cookie
   * @param c - The context
   * @returns Success
   */
  .post("/logout", async (c) => {
    const refreshToken = getCookie(c, Constants.refreshToken);

    if (refreshToken) {
      try {
        const payload = await verifyToken(refreshToken, "refresh");
        if (payload?.jti) {
          await deleteToken("id", payload.jti);
        }
      } catch {
        return c.json({ success: false as const, error: "Failed to delete refresh token" }, 401);
      }
    }

    setCookie(c, Constants.accessToken, "", getCookieSettings("clear"));
    setCookie(c, Constants.refreshToken, "", getCookieSettings("clear"));

    return c.json({ success: true as const });
  })

  /**
   * Get the current user
   * @param c - The context
   * @returns The current user
   */
  .get("/me", getAuthContext, async (c) => {
    const authContext = c.var.authContext;
    return c.json({ success: true as const, ...authContext });
  })

  /**
   * Check if an email is available
   * @param c - The context
   * @returns Whether the email is available
   */
  .get("/available", validationMiddleware("query", availableSchema), async (c) => {
    try {
      const { email } = c.req.valid("query");
      const exists = await getUserExists("email", email);

      return c.json({ success: true as const, available: !exists });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
