import type { AppType } from "@bunstack/api";

import { Constants } from "@bunstack/shared/constants";
import { hc } from "hono/client";

async function fetchWithRefresh(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const accessToken = localStorage.getItem(Constants.accessToken);
  const headers = new Headers(init?.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(input, { ...init, headers, credentials: "include" });

  if (res.status === 401) {
    const client = hc<AppType>("/", {
      init: { credentials: "include" },
    });

    const refreshRes = await client.api.auth.refresh.$post();

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      const newAccessToken = data.accessToken;
      if (newAccessToken) {
        localStorage.setItem(Constants.accessToken, newAccessToken);
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        res = await fetch(input, { ...init, headers, credentials: "include" });
      }
    }
  }

  return res;
}

// add dummy `preconnect` to satisfy hc typing
(fetchWithRefresh as any).preconnect = undefined;

const client = hc<AppType>("/", {
  init: { credentials: "include" },
  fetch: fetchWithRefresh,
});

export const api = client.api;
