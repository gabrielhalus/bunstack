import { validateEnv } from "@bunstack/env";
import { z } from "zod";

export const env = validateEnv({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  VITE_API_URL: z.url(),
  VITE_AUTH_URL: z.url(),
});
