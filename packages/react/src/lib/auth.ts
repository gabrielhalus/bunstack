import type { Session } from "@bunstack/shared/types/auth";
import type { QueryClient } from "@tanstack/react-query";

import { redirect } from "@tanstack/react-router";

import { env } from "../lib/env";
import { authQueryOptions } from "../queries/auth";

export type AuthDeps = {
  queryClient: QueryClient;
  getCurrentUrl?: () => string;
};

export type AuthOptions = {
  redirect?: boolean;
};

/**
 * Factory for the `auth()` helper.
 */
export function createAuth({ queryClient, getCurrentUrl = () => window.location.href }: AuthDeps) {
  return async function auth<T extends boolean = true>(options?: AuthOptions & { redirect?: T }): Promise<T extends true ? Session : Session | undefined> {
    const shouldRedirect = options?.redirect ?? true;

    try {
      return await queryClient.ensureQueryData(authQueryOptions as any);
    } catch {
      if (shouldRedirect) {
        throw redirect({
          href: `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(getCurrentUrl())}`,
          replace: true,
        });
      }
      return undefined as unknown as T extends true ? Session : Session | undefined;
    }
  };
}
