import type { AppType } from "@bunstack/api";

import { hc } from "hono/client";

import { env } from "./env";

const api = hc<AppType>(env.NODE_ENV === "production" ? env.NEXT_PUBLIC_API_URL : "/api", {
  init: { credentials: "include" },
});

export { api };
