import type { Session } from "@bunstack/shared/types/auth";

import { redirect } from "@tanstack/react-router";

import { env } from "../lib/env";
import { authQueryOptions } from "../queries/auth";
import { queryClient } from "./query-client";

export type AuthDeps = {
  getCurrentUrl?: () => string;
};

export type AuthOptionsBase = {
  /** Redirect when unauthenticated (default: true) */
  redirectOnUnauthenticated?: boolean;
};

/** Variant: redirect when authenticated → never returns */
export type AuthOptionsRedirectAuthenticated = {
  redirectOnAuthenticated: boolean;
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
  getCurrentUrl = () => window.location.href,
}: AuthDeps = {}) {
  // --- Overloads for proper type inference ---
  async function auth(options?: AuthOptionsNormal): Promise<Session>;
  async function auth(options: AuthOptionsRedirectAuthenticated): Promise<never>;
  async function auth(options?: AuthOptions): Promise<Session | undefined | never> {
    const {
      redirectOnUnauthenticated = true,
      redirectOnAuthenticated = false,
    } = options ?? {};

    const currentUrl = getCurrentUrl();

    // Helper: compute redirect URL and avoid loop
    const computeRedirect = (shouldRedirect: boolean, fallbackUrl: string) => {
      if (!shouldRedirect) {
        return null;
      }

      return currentUrl !== fallbackUrl ? fallbackUrl : null;
    };

    try {
      const session = await queryClient.ensureQueryData(authQueryOptions);

      // Redirect if authenticated
      const redirectToAuth = computeRedirect(redirectOnAuthenticated, env.VITE_SITE_URL);
      if (redirectToAuth) {
        throw redirect({ href: redirectToAuth, replace: true });
      }

      return session;
    } catch {
      // Redirect if unauthenticated
      const redirectToUnauth = computeRedirect(redirectOnUnauthenticated, `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(currentUrl)}`);
      if (redirectToUnauth) {
        throw redirect({ href: redirectToUnauth, replace: true });
      }

      return undefined;
    }
  }

  return auth;
}
