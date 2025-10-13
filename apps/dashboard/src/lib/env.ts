import { z } from "zod";

import { validateEnv } from "@bunstack/env";

export const env = validateEnv({
  VITE_AUTH_URL: z.url(),
});
