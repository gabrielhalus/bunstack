import type { PermissionCheck } from "@bunstack/shared/access/types";

import { can } from "@bunstack/shared/access";
import { Hono } from "hono";

export default new Hono()
  .post("/check", async (c) => {
    const { user, permissionName, resource } = await c.req.json<PermissionCheck>();

    try {
      const allowed = await can({ permissionName, user, resource });
      return c.json({ success: true, allowed });
    }
    catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
