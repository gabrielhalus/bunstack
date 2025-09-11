import { deleteRole, getRole, getRoles, updateRole } from "@bunstack/shared/db/queries/roles";
import { updateRoleSchema } from "@bunstack/shared/db/types/roles";
import { Hono } from "hono";

import { requirePermission } from "@/middlewares/access-control";
import { getAuthContext } from "@/middlewares/auth";

export default new Hono()
  .use(getAuthContext)

  .get("/", requirePermission("role:list"), async (c) => {
    try {
      const params = c.req.query();

      const page = params.page ? Number(params.page) : 0;
      const pageSize = params.pageSize ? Number(params.pageSize) : Number.MAX_SAFE_INTEGER;
      
      // Add sorting parameters
      const sortField = params.sortField || "index";
      const sortDirection = params.sortDirection || "desc";
      
      // Add search parameter
      const search = params.search;
      
      if (Number.isNaN(page) || page < 0 || Number.isNaN(pageSize) || pageSize < 1) {
        return c.json({ success: false, error: "Invalid pagination parameters" }, 400);
      }

      // Validate sort direction
      if (!["asc", "desc"].includes(sortDirection)) {
        return c.json({ success: false, error: "Invalid sort direction" }, 400);
      }

      const { roles, total } = await getRoles(page, pageSize, { 
        field: sortField as keyof Role, 
        direction: sortDirection as "asc" | "desc" 
      }, search);

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

  .delete("/:id", requirePermission("role:delete", c => ({ id: c.req.param("id") })), async (c) => {
    const id = Number(c.req.param("id"));

    try {
      const role = await deleteRole("id", id);
      return c.json({ success: true, role });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
