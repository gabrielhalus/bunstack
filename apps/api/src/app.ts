import { Hono } from "hono";
import { logger } from "hono/logger";

import cors from "@bunstack/api/middlewares/cors";
import serveEmojiFavicon from "@bunstack/api/middlewares/serve-emoji-favicon";
import auth from "@bunstack/api/routes/auth";
import email from "@bunstack/api/routes/email";
import preview from "@bunstack/api/routes/preview";
import roles from "@bunstack/api/routes/roles";
import users from "@bunstack/api/routes/users";

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
  .route("/email", email)
  .route("/preview", preview)
  .route("/roles", roles)
  .route("/users", users);

export default app;
export type AppType = typeof _api;
