import type { AuthResult } from "@bunstack/shared/types/auth";

import { authQueryOptions } from "@/queries/auth";
import { queryClient } from "@/main";

export async function auth(): Promise<AuthResult> {
  // Preload from cache or fetch
  return await queryClient.ensureQueryData(authQueryOptions);
}
