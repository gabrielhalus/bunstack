import { defineConfig } from "drizzle-kit";
import { join } from "node:path";

import { __root } from "./src/constants/__root";

export default defineConfig({
  schema: join(__dirname, "src/database/schemas/*.ts"),
  out: join(__dirname, "src/database/migrations"),
  dialect: "sqlite",
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: join(__root, process.env.DATABASE_URL!),
  },
});
