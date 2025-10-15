import { z } from "zod";

import { validateEnv } from "@bunstack/env";

export const env = validateEnv({
  // eslint-disable-next-line node/no-process-env
  VITE_API_URL: process.env.NODE_ENV === "production" ? z.url() : z.string(),
  VITE_SITE_URL: z.url(),
  VITE_AUTH_URL: z.url(),
});
