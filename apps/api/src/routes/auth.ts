import { Constants } from "@bunstack/shared/constants";
import { availableSchema, loginSchema, registerSchema } from "@bunstack/shared/contracts/auth";
import { deleteToken, getToken, insertToken } from "@bunstack/shared/db/queries/tokens";
import { getUserExists, insertUser } from "@bunstack/shared/db/queries/users";
import env from "@bunstack/shared/env";
import { password } from "bun";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { getClientInfo } from "@/helpers/get-client-info";
import { createAccessToken, createRefreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS, validateUser, verifyToken } from "@/lib/auth";
import { getAuthContext } from "@/middlewares/auth";
import { validationMiddleware } from "@/middlewares/validation";

export default new Hono()
  /**
   * Register a new user
   * @param c - The context
   * @returns The access token
   */
  .post("/register", validationMiddleware("json", registerSchema), async (c) => {
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
      const refreshToken = await createRefreshToken(insertedUser.id, insertedToken.id);

      setCookie(c, "refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_EXPIRATION_SECONDS,
      });

      return c.json({ success: true, accessToken });
    } catch (error) {
      if (error instanceof Error && error.message.includes("UNIQUE constraint failed: users.email")) {
        return c.json({ success: false, error: "Email is already taken" }, 400);
      }

      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Login a user
   * @param c - The context
   * @returns The access token
   */
  .post("/login", validationMiddleware("json", loginSchema), async (c) => {
    const credentials = c.req.valid("json");

    try {
      const userId = await validateUser(credentials);
      if (!userId) {
        return c.json({ success: false, error: "Invalid credentials" }, 200);
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
      const refreshToken = await createRefreshToken(userId, insertedToken.id);

      setCookie(c, Constants.refreshToken, refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_EXPIRATION_SECONDS,
      });

      return c.json({ success: true, accessToken });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Refresh the access token using the refresh token cookie
   * @param c - The context
   * @returns The new access token
   */
  .post("/refresh", async (c) => {
    const refreshToken = getCookie(c, Constants.refreshToken);

    if (!refreshToken) {
      return c.json({ error: "No refresh token provided" }, 401);
    }

    try {
      const payload = await verifyToken(refreshToken, "refresh");
      if (!payload)
        throw new Error("Invalid refresh token");

      const { sub, jti } = payload;
      const tokenRecord = await getToken("id", jti);

      if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
        if (jti)
          await deleteToken("id", jti);
        return c.json({ success: false, error: "Refresh token expired or invalid" }, 401);
      }

      const accessToken = await createAccessToken(sub);
      return c.json({ success: true, accessToken });
    } catch {
      // Attempt to clean up invalid token if possible
      try {
        const payload = await verifyToken(refreshToken, "refresh");
        if (payload?.jti)
          await deleteToken("id", payload.jti);
      } catch {}
      return c.json({ success: false, error: "Invalid refresh token" }, 401);
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
        return c.json({ success: false, error: "Failed to delete refresh token" }, 401);
      }
    }

    setCookie(c, "refreshToken", "", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge: 0,
    });

    return c.json({ success: true });
  })

  /**
   * Get the current user
   * @param c - The context
   * @returns The current user
   */
  .get("/me", getAuthContext, async (c) => {
    const authContext = c.var.authContext;
    return c.json({ success: true, ...authContext });
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

      return c.json({ success: true, available: !exists });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
