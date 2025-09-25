import { validateEnv } from "@bunstack/env";
import { z } from "zod";

export const env = validateEnv({
  DATABASE_URL: z.string(),
});
