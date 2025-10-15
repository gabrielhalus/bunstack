import type { Session } from "@bunstack/shared/types/auth";
import type { QueryClient } from "@tanstack/react-query";

import { redirect } from "@tanstack/react-router";

import { env } from "../lib/env";
import { authQueryOptions } from "../queries/auth";

export type AuthDeps = {
  queryClient: QueryClient;
  getCurrentUrl?: () => string;
};

export type AuthOptionsBase = {
  /** Redirect when unauthenticated (default: true) */
  redirectOnUnauthenticated?: boolean;
};

/** Variant: redirect when authenticated → never returns */
export type AuthOptionsRedirectAuthenticated = {
  redirectOnAuthenticated: boolean | string;
} & AuthOptionsBase;

/** Variant: doesn’t redirect when authenticated → returns Session/undefined */
export type AuthOptionsNormal = {
  redirectOnAuthenticated?: false;
} & AuthOptionsBase;

/** Union for function overloads */
export type AuthOptions = AuthOptionsNormal | AuthOptionsRedirectAuthenticated;

/**
 * Factory for the `auth()` helper.
 * Injects app-specific dependencies (queryClient, env, etc.)
 */
export function createAuth({
  queryClient,
  getCurrentUrl = () => window.location.href,
}: AuthDeps) {
  // --- Overloads for proper type inference ---
  async function auth(options?: AuthOptionsNormal): Promise<Session>;
  async function auth(options: AuthOptionsRedirectAuthenticated): Promise<never>;
  async function auth(options?: AuthOptions): Promise<Session | undefined | never> {
    const {
      redirectOnUnauthenticated = true,
      redirectOnAuthenticated = false,
    } = options ?? {};

    try {
      const session = (await queryClient.ensureQueryData(authQueryOptions as any)) as Session;

      if (redirectOnAuthenticated) {
        const href
          = typeof redirectOnAuthenticated === "string"
            ? redirectOnAuthenticated
            : `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(getCurrentUrl())}`;

        throw redirect({ href, replace: true });
      }

      return session;
    } catch {
      if (redirectOnUnauthenticated) {
        throw redirect({
          href: `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(getCurrentUrl())}`,
          replace: true,
        });
      }

      return undefined;
    }
  }

  return auth;
}
