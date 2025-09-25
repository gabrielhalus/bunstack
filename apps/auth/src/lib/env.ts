import { validateEnv } from "@bunstack/env";
import { z } from "zod";

export const env = validateEnv({
  NEXT_PUBLIC_API_URL: z.url(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});
