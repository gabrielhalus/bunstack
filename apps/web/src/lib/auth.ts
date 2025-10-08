import type { AuthResult } from "@bunstack/shared/types/auth";

import { queryClient } from "@/main";
import { authQueryOptions } from "@/queries/auth";

export async function auth(): Promise<AuthResult> {
  // Preload from cache or fetch
  return await queryClient.ensureQueryData(authQueryOptions);
}
