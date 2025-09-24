import type { AppType } from "@bunstack/api";

import { hc } from "hono/client";

const api = hc<AppType>("http://api.localhost", {
  init: { credentials: "include" },
});

export { api };
