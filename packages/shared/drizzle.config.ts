import { defineConfig } from "drizzle-kit";
import { join } from "node:path";

// eslint-disable-next-line no-console, node/no-process-env
console.log("HELLO", process.env.DATABASE_URL!);

export default defineConfig({
  schema: join(__dirname, "src/database/schemas/*.ts"),
  out: join(__dirname, "src/database/migrations"),
  dialect: "postgresql",
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: process.env.DATABASE_URL!,
  },
});
