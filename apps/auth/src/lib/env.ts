import { validateEnv } from "@bunstack/env";
import { z } from "zod";

export const env = validateEnv({
  VITE_API_URL: z.string(),
});
