import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

import serveEmojiFavicon from "@/middlewares/serve-emoji-favicon";
import auth from "@/routes/auth";
import roles from "@/routes/roles";
import users from "@/routes/users";

const app = new Hono({ strict: false });

// Middleware
app.use(logger(), serveEmojiFavicon("🔥"));

// API routes
const _routes = app.basePath("/api")
  .route("/auth", auth)
  .route("/users", users)
  .route("/roles", roles);

// Serve static files from the React Build
app.use("/*", serveStatic({ root: "../web/dist" }));
app.use("*", serveStatic({ root: "../web/dist", path: "index.html" }));

export default app;
export type AppType = typeof _routes;
