import { password } from "bun";
import { sign, verify } from "hono/jwt";

import { env } from "@bunstack/api/lib/env";
import { findUserWithPassword } from "@bunstack/shared/database/queries/users";

export const ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const VERIFICATION_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24; // 1 day

export type JwtPayload
  = | {
    sub: string;
    iat: number;
    exp: number;
    ttyp: "access";
    iss: string;
  }
  | {
    sub: string;
    iat: number;
    exp: number;
    ttyp: "refresh";
    jti: string;
    iss: string;
  }
  | {
    sub: string;
    iat: number;
    exp: number;
    jti: string;
    ttyp: "verification";
    iss: string;
  };

export async function validateUser({ email, password: pwd }: { email: string; password: string }): Promise<string | null> {
  const user = await findUserWithPassword(email);
  if (user?.password && await password.verify(pwd, user.password)) {
    return user.id;
  }

  return null;
}

export async function createAccessToken(userId: string): Promise<string> {
  const payload: JwtPayload = {
    sub: userId,
    ttyp: "access",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION_SECONDS,
    iss: "bunstack",
  };

  return await sign(payload, env.JWT_SECRET);
}

export async function createRefreshToken(userId: string, jti: string): Promise<string> {
  const payload: JwtPayload = {
    sub: userId,
    jti,
    ttyp: "refresh",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION_SECONDS,
    iss: "bunstack",
  };

  return await sign(payload, env.JWT_SECRET);
}

export async function createVerificationToken(userId: string, jti: string): Promise<string> {
  const payload: JwtPayload = {
    sub: userId,
    jti,
    ttyp: "verification",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + VERIFICATION_TOKEN_EXPIRATION_SECONDS,
    iss: "bunstack",
  };

  return await sign(payload, env.JWT_SECRET);
}

export async function verifyToken<T extends JwtPayload["ttyp"]>(
  token: string,
  type: T,
): Promise<Extract<JwtPayload, { ttyp: T }> | null> {
  try {
    const payload = await verify(token, env.JWT_SECRET) as JwtPayload;
    return payload.ttyp === type ? payload as Extract<JwtPayload, { ttyp: T }> : null;
  } catch {
    return null;
  }
}

type CookieType = "access" | "refresh" | "clear";

export function getCookieSettings(type: CookieType) {
  const isProd = env.NODE_ENV === "production";

  // Detect if we are using subdomain testing builds
  const isSubdomainDev = !isProd && env.HOSTNAME?.endsWith(".localhost.dev");

  const base = {
    httpOnly: true,
    path: "/",
    domain: isProd
      ? `.${env.HOSTNAME}` // prod: example.com → .example.com
      : isSubdomainDev
        ? `.${env.HOSTNAME}` // dev subdomains → .localhost.dev
        : undefined, // real dev with ports → no domain, host-only
    secure: isProd || isSubdomainDev, // must be true for SameSite=None
    sameSite: isProd || isSubdomainDev ? "none" as const : "lax" as const,
  };

  switch (type) {
    case "access":
      return { ...base, maxAge: Number(ACCESS_TOKEN_EXPIRATION_SECONDS) };
    case "refresh":
      return { ...base, maxAge: Number(REFRESH_TOKEN_EXPIRATION_SECONDS) };
    case "clear":
      return { ...base, maxAge: 0, expires: new Date(0) };
  }
}
