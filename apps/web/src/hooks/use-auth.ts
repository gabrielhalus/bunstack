import type { AuthResult } from "@bunstack/shared/types/auth";

import { createContext, use } from "react";

export const AuthContext = createContext<AuthResult | null>(null);

export function useAuth(): AuthResult {
  const ctx = use(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
