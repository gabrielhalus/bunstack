import { z } from "zod";

import { validateEnv } from "@bunstack/env";

export const env = validateEnv({
  DATABASE_URL: z.string(),
});
