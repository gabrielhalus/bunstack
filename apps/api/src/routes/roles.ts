import { deleteRole, getRole, getRoles, updateRole, updateRoleLevel } from "@bunstack/shared/db/queries/roles";
import { updateRoleLevelSchema, updateRoleSchema } from "@bunstack/shared/db/types/roles";
import { Hono } from "hono";

import { requirePermission } from "@/middlewares/access-control";
import { getAuthContext } from "@/middlewares/auth";

export default new Hono()
  .use(getAuthContext)

  .get("/", requirePermission("role:list"), async (c) => {
    try {
      const page = Number(c.req.query("page") ?? "1");
      const limit = Number(c.req.query("limit") ?? "25");

      if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
        return c.json({ success: false, error: "Invalid pagination parameters" }, 400);
      }

      const { roles, total } = await getRoles(page, limit, { field: "level", direction: "desc" });

      return c.json({ success: true, roles, total });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .get("/:name", requirePermission("role:read"), async (c) => {
    const { name } = c.req.param();

    try {
      const role = await getRole("name", name);
      return c.json({ success: true, role });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .put("/:id", requirePermission("role:edit", c => ({ id: c.req.param("id") })), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const rawRole = await c.req.json();

      const role = updateRoleSchema.parse(rawRole);

      const updatedRole = await updateRole("id", id, role);
      return c.json({ success: true, role: updatedRole });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .put("/:id/order", requirePermission("role:edit", c => ({ id: c.req.param("id") })), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const rawRole = await c.req.json();

      const role = updateRoleLevelSchema.parse(rawRole);

      if (role.level === undefined || role.level === null) {
        return c.json({ success: false, error: "Level is required" }, 400);
      }

      const updatedRole = await updateRoleLevel("id", id, role.level);
      if (!updatedRole) {
        return c.json({ success: false, error: "Not found" }, 404);
      }

      return c.json({ success: true, role: updatedRole });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .delete("/:id", requirePermission("role:delete", c => ({ id: c.req.param("id") })), async (c) => {
    const id = Number(c.req.param("id"));

    try {
      const role = await deleteRole("id", id);
      return c.json({ success: true, role });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
