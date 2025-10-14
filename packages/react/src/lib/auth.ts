import type { Session } from "@bunstack/shared/types/auth";

import { redirect } from "@tanstack/react-router";

import { env } from "@/lib/env";
import { queryClient } from "@/main";
import { authQueryOptions } from "@/queries/auth";

export async function auth<T extends boolean = true>(
  options?: { redirect?: T },
): Promise<T extends true ? Session : Session | undefined> {
  const shouldRedirect = options?.redirect ?? true;

  try {
    return await queryClient.ensureQueryData(authQueryOptions);
  } catch {
    if (shouldRedirect) {
      throw redirect({
        href: `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(window.location.href)}`,
        replace: true,
      });
    }
    return undefined as any;
  }
}
