import { getRole, getRoles } from "@bunstack/shared/db/queries/roles";
import { Hono } from "hono";

import { getAuthContext } from "@/middlewares/auth";
import { requirePermission } from "@/middlewares/authorization";

export default new Hono()
  .use(getAuthContext)

  .get("/", requirePermission("manage:roles"), async (c) => {
    try {
      const page = Number(c.req.query("page") ?? "1");
      const limit = Number(c.req.query("limit") ?? "25");

      if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
        return c.json({ success: false, error: "Invalid pagination parameters" }, 400);
      }

      const { roles, total } = await getRoles(page, limit);

      return c.json({ success: true, roles, total });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .get("/:name", requirePermission("manage:roles"), async (c) => {
    const { name } = c.req.param();

    try {
      const role = await getRole("name", name);
      return c.json({ success: true, role });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
