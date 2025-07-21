import { defineConfig } from "drizzle-kit";
import { join } from "node:path";

import { __root } from "./src/constants/__root";
import env from "./src/lib/env";

export default defineConfig({
  schema: join(__dirname, "src/schemas/**/*.ts"),
  out: join(__dirname, "src/db/migrations"),
  dialect: "sqlite",
  dbCredentials: {
    url: join(__root, env.DATABASE_URL),
  },
});
