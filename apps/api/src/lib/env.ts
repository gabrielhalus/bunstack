import { z } from "zod";
import "dotenv/config"; // loads default .env in current folder

import { validateEnv } from "@bunstack/env";

export const env = validateEnv({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  HOSTNAME: z.string().regex(z.regexes.hostname).default("localhost"),
  JWT_SECRET: z.string(),
});
