import { env } from "@bunstack/shared/lib/env";
import { defineConfig } from "drizzle-kit";
import { join } from "node:path";

import { __root } from "@bunstack/shared/constants/__root";

export default defineConfig({
  schema: join(__dirname, "src/database/schemas/*.ts"),
  out: join(__dirname, "src/database/migrations"),
  dialect: "sqlite",
  dbCredentials: {
    url: join(__root, env.DATABASE_URL),
  },
});
