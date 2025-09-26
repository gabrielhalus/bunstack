import { validateEnv } from "@bunstack/env";
import "dotenv/config"; // loads default .env in current folder
import { z } from "zod";

export const env = validateEnv({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  HOSTNAME: z.string().default("localhost"),
  JWT_SECRET: z.string(),
});
