import { validateEnv } from "@bunstack/env";
import { z } from "zod";

export const env = validateEnv({
  DATABASE_URL: z.string(),
  HOSTNAME: z.string().default("localhost"),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});
