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
const api = app.basePath("/")
  .route("/auth", auth)
  .route("/users", users)
  .route("/roles", roles);

// Only serve API if host = api.bunstack.com
app.use("*", async (c, next) => {
  const host = c.req.header("host");
  if (host && host.startsWith("api.")) {
    return api.fetch(c.req.raw);
  }
  await next();
});

// -------------------
// Admin (React static build)
// -------------------
// Served from ../web/dist when host = admin.bunstack.com
app.use("*", async (c, next) => {
  const host = c.req.header("host");
  if (host && host.startsWith("admin.")) {
    return serveStatic({ root: "../web/dist" })(c, next);
  }
  await next();
});

// React SPA fallback for client-side routing
app.use("*", async (c, next) => {
  const host = c.req.header("host");
  if (host && host.startsWith("admin.")) {
    return serveStatic({ root: "../web/dist", path: "index.html" })(c, next);
  }
  await next();
});

// -------------------
// Auth (Next.js @ port 4002)
// -------------------
// Proxy requests to Next server running locally
app.use("*", async (c, next) => {
  const host = c.req.header("host");
  if (host && host.startsWith("auth.")) {
    const url = new URL(c.req.url);
    url.protocol = "http";
    url.hostname = "localhost";
    url.port = "4002"; // Next.js dev/prod server

    return fetch(url.toString(), {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    });
  }
  await next();
});

export default app;
export type AppType = typeof api;
