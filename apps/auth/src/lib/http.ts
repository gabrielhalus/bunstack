import type { AppType } from "@bunstack/api";

import { hc } from "hono/client";

// eslint-disable-next-line node/no-process-env
const api = hc<AppType>(process.env.NODE_ENV === "production" ? "http://api.localhost" : "/api", {
  init: { credentials: "include" },
});

export { api };
