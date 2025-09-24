import app from "@bunstack/api/app";
import "@bunstack/shared/lib/env";

// eslint-disable-next-line no-console
console.log("🚀 Server is running on port 4000");

Bun.serve({
  fetch: app.fetch,
  port: 4000,
});
