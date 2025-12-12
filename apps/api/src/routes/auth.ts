import { password } from "bun";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { getClientInfo } from "@bunstack/api/helpers/get-client-info";
import { createAccessToken, createRefreshToken, getCookieSettings, REFRESH_TOKEN_EXPIRATION_SECONDS, validateUser, verifyToken } from "@bunstack/api/lib/auth";
import { getAuthContext } from "@bunstack/api/middlewares/auth";
import { validationMiddleware } from "@bunstack/api/middlewares/validation";
import { deleteToken, getTokenById, insertToken } from "@bunstack/db/queries/tokens";
import { insertUser, updateUserById } from "@bunstack/db/queries/users";
import { loginInputSchema, registerInputSchema, verifyAccountSchema } from "@bunstack/shared/contracts/auth";

export const authRoutes = new Hono()
  /**
   * Register a new user
   *
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
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000).toISOString(),
        ...getClientInfo(c),
      });

      const accessToken = await createAccessToken(insertedUser.id);
      setCookie(c, "accessToken", accessToken, getCookieSettings("access"));

      const refreshToken = await createRefreshToken(insertedUser.id, insertedToken.id);
      setCookie(c, "refreshToken", refreshToken, getCookieSettings("refresh"));

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
   *
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

      const insertedToken = await insertToken({
        userId,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000).toISOString(),
        ...getClientInfo(c),
      });

      const accessToken = await createAccessToken(userId);
      setCookie(c, "accessToken", accessToken, getCookieSettings("access"));

      const refreshToken = await createRefreshToken(userId, insertedToken.id);
      setCookie(c, "refreshToken", refreshToken, getCookieSettings("refresh"));

      return c.json({ success: true as const });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Logout a user by clearing the refresh token cookie
   *
   * @param c - The context
   * @returns Success
   */
  .post("/logout", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");

    if (refreshToken) {
      try {
        const payload = await verifyToken(refreshToken, "refresh");
        if (payload?.jti) {
          await deleteToken(payload.jti);
        }
      } catch {
        return c.json({ success: false as const, error: "Failed to delete refresh token" }, 401);
      }
    }

    setCookie(c, "accessToken", "", getCookieSettings("clear"));
    setCookie(c, "refreshToken", "", getCookieSettings("clear"));

    return c.json({ success: true as const });
  })

  /**
   * Verify user
   *
   * @param c - The context
   * @returns Success
   */
  .get("/verify", validationMiddleware("query", verifyAccountSchema), async (c) => {
    const { token } = c.req.valid("query");

    try {
      const payload = await verifyToken(token, "verification");
      if (!payload) {
        return c.json({ success: false as const, error: "Invalid token" }, 401);
      }

      const { sub: userId, jti } = payload;
      if (!jti) {
        return c.json({ success: false as const, error: "Invalid token" }, 401);
      }

      const tokenRecord = await getTokenById(jti);
      if (!tokenRecord || tokenRecord.expiresAt < new Date().toISOString() || tokenRecord.revokedAt) {
        if (tokenRecord) {
          await deleteToken(jti);
        }
        return c.json({ success: false as const, error: "Invalid token" }, 401);
      }

      const user = await updateUserById(userId, { verifiedAt: new Date().toISOString() });
      if (!user) {
        return c.json({ success: false as const, error: "User not found" }, 404);
      }

      await deleteToken(jti);

      return c.json({ success: true as const });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Verify account error:", errorMsg);
      return c.json({ success: false as const, error: errorMsg }, 500);
    }
  })

  // --- All routes below this point require authentication
  .use(getAuthContext)

  /**
   * Get the authenticated user
   *
   * @param c - The context
   * @returns The authenticated user
   */
  .get("/", async (c) => {
    const authContext = c.var.authContext;
    return c.json({ success: true as const, ...authContext });
  });
