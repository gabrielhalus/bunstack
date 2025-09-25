import type { AppType } from "@bunstack/api";

import { hc } from "hono/client";

import { env } from "./env";

const api = hc<AppType>(env.VITE_API_URL, {
  init: { credentials: "include" },
});

export { api };
