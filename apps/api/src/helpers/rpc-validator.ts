import type { Context, MiddlewareHandler } from "hono";
import type { z } from "zod";

import { validator } from "hono/validator"; // low-level base of zValidator

export function rpcValidator<T extends z.ZodTypeAny>(target: "json" | "query" | "param" | "form", schema: T): MiddlewareHandler {
  return validator(target, (value, c: Context) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: parsed.error.issues.map(i => i.message).join(", "),
        },
        200,
      );
    }

    return parsed.data; // 👈 makes `c.req.valid(target)` typed
  });
}
