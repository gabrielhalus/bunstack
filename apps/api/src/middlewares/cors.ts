import type { MiddlewareHandler } from "hono";

import { cors } from "hono/cors";

import env from "@bunstack/shared/lib/env";

export default function (): MiddlewareHandler {
  return cors({
    origin: (originHeader) => {
      if (!originHeader) {
        return null;
      }

      const url = new URL(originHeader);
      return url.hostname === env.HOSTNAME || url.hostname.endsWith(`.${env.HOSTNAME}`) ? originHeader : null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}
