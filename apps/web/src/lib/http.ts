import type { AppType } from "@bunstack/api";

import { hc } from "hono/client";

const client = hc<AppType>("/", {
  init: {
    credentials: "include",
  },
});

export const api = client.api;
