import type { MiddlewareHandler } from "hono";

import env from "@bunstack/shared/env";
import { cors } from "hono/cors";

export default function (): MiddlewareHandler {
  return cors({
    origin: (originHeader) => {
      if (!originHeader) {
        return null;
      }

      const url = new URL(originHeader);
      return url.hostname.endsWith(env.HOSTNAME) ? originHeader : null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}
