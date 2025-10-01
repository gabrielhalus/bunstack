import type { Role } from "@bunstack/shared/database/types/roles";

import { Hono } from "hono";

import { requirePermission } from "@bunstack/api/middlewares/access-control";
import { getAuthContext } from "@bunstack/api/middlewares/auth";
import { validationMiddleware } from "@bunstack/api/middlewares/validation";
import { paginationInputSchema } from "@bunstack/shared/contracts/pagination";
import { updateRoleInputSchema } from "@bunstack/shared/contracts/roles";
import { deleteRole, getRole, getRoles, updateRole } from "@bunstack/shared/database/queries/roles";

export default new Hono()
  .use(getAuthContext)

  .get("/", requirePermission("role:list"), validationMiddleware("query", paginationInputSchema), async (c) => {
    try {
      const { page, pageSize, search, sortField, sortDirection } = c.req.valid("query");

      const orderBy = sortField ? { field: sortField as keyof Role, direction: sortDirection } : undefined;
      const { roles, total } = await getRoles(page, pageSize, orderBy, search);

      return c.json({ success: true as const, roles, total });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .get("/:name", requirePermission("role:read"), async (c) => {
    const { name } = c.req.param();

    try {
      const role = await getRole("name", name);

      if (!role) {
        return c.json({ success: false as const, error: "Role not found" }, 404);
      }

      return c.json({ success: true as const, role });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .put("/:id", requirePermission("role:edit", c => ({ id: c.req.param("id") })), validationMiddleware("json", updateRoleInputSchema), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const rawRole = await c.req.json();

      const role = updateRoleInputSchema.parse(rawRole);

      const updatedRole = await updateRole("id", id, role);
      return c.json({ success: true as const, role: updatedRole });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .delete("/:id", requirePermission("role:delete", c => ({ id: c.req.param("id") })), async (c) => {
    const id = Number(c.req.param("id"));

    try {
      const role = await deleteRole("id", id);
      return c.json({ success: true as const, role });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
