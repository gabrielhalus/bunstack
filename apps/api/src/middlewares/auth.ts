import { Constants } from "@bunstack/shared/constants";
import { deleteToken, getToken } from "@bunstack/shared/database/queries/tokens";
import { getUserWithContext } from "@bunstack/shared/database/queries/users";
import { getCookie, setCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { createAccessToken, getCookieSettings, verifyToken } from "@bunstack/api/lib/auth";
import { env } from "@bunstack/api/lib/env";
import { factory } from "@bunstack/api/utils/hono";

/**
 * Get the user from the JWT token and set the auth context
 * Automatically refreshes the access token if it's expired but refresh token is valid
 * @param c - The context
 * @param next - The next middleware
 * @returns The user
 */
export const getAuthContext = factory.createMiddleware(async (c, next) => {
  const accessToken = getCookie(c, Constants.accessToken);
  let decoded;

  // Try to verify the access token
  if (accessToken) {
    try {
      decoded = await verify(accessToken, env.JWT_SECRET);
    } catch {
      // Access token is invalid/expired, try to refresh
      decoded = await attemptTokenRefresh(c);
      if (!decoded) {
        return c.json({ error: "Unauthorized" }, 401);
      }
    }
  } else {
    // No access token, try to refresh
    decoded = await attemptTokenRefresh(c);
    if (!decoded) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }

  const { user, ...context } = await getUserWithContext("id", decoded.sub as string);

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("authContext", { user, ...context });

  await next();
});

/**
 * Attempt to refresh the access token using the refresh token
 * @param c - The context
 * @returns The decoded access token payload or null if refresh failed
 */
async function attemptTokenRefresh(c: any) {
  const refreshToken = getCookie(c, Constants.refreshToken);

  if (!refreshToken) {
    return null;
  }

  try {
    const payload = await verifyToken(refreshToken, "refresh");
    if (!payload) {
      return null;
    }

    const { sub, jti } = payload;
    const tokenRecord = await getToken("id", jti);

    if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
      // Clean up expired token
      if (jti) {
        await deleteToken("id", jti);
      }
      return null;
    }

    // Create new access token
    const newAccessToken = await createAccessToken(sub);
    setCookie(c, Constants.accessToken, newAccessToken, getCookieSettings("access"));

    // Verify and return the new token
    return await verify(newAccessToken, env.JWT_SECRET);
  } catch {
    return null;
  }
}
