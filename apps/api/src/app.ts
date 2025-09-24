import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

import cors from "@/middlewares/cors";
import serveEmojiFavicon from "@/middlewares/serve-emoji-favicon";
import auth from "@/routes/auth";
import roles from "@/routes/roles";
import users from "@/routes/users";

const app = new Hono({ strict: false });

// -------------------
// Global Middlewares
// -------------------
app.use(logger());
app.use(serveEmojiFavicon("🔥"));

// -------------------
// Dynamic CORS
// -------------------
app.use(cors());

// -------------------
// API (Hono @ port 4000)
// -------------------
const _api = app
  .route("/auth", auth)
  .route("/users", users)
  .route("/roles", roles);

export default app;
export type AppType = typeof _api;
