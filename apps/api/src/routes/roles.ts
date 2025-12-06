import type { Role } from "@bunstack/shared/database/types/roles";

import { Hono } from "hono";

import { requirePermission } from "@bunstack/api/middlewares/access-control";
import { getAuthContext } from "@bunstack/api/middlewares/auth";
import { validationMiddleware } from "@bunstack/api/middlewares/validation";
import { paginationInputSchema } from "@bunstack/shared/contracts/pagination";
import { updateRoleInputSchema } from "@bunstack/shared/contracts/roles";
import { assignRoleInputSchema, removeRoleInputSchema } from "@bunstack/shared/contracts/user-roles";
import { deleteRoleById, getRoleByName, getRoles, updateRoleById } from "@bunstack/shared/database/queries/roles";
import { assignUserRole, removeUserRole } from "@bunstack/shared/database/queries/user-roles";

export const rolesRoutes = new Hono()
  // --- All routes below this point require authentication
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
      const role = await getRoleByName(name);

      if (!role) {
        return c.json({ success: false as const, error: "Role not found" }, 404);
      }

      return c.json({ success: true as const, role });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .put("/:id", requirePermission("role:update", c => ({ id: c.req.param("id") })), validationMiddleware("json", updateRoleInputSchema), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const role = c.req.valid("json");

      const updatedRole = await updateRoleById(id, role);
      return c.json({ success: true as const, role: updatedRole });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .delete("/:id", requirePermission("role:delete", c => ({ id: c.req.param("id") })), async (c) => {
    const id = Number(c.req.param("id"));

    try {
      const role = await deleteRoleById(id);
      return c.json({ success: true as const, role });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .post("/assign", requirePermission("userRole:create"), validationMiddleware("json", assignRoleInputSchema), async (c) => {
    const { userId, roleId } = c.req.valid("json");

    try {
      const userRole = await assignUserRole({ userId, roleId });
      return c.json({ success: true as const, userRole });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  .post("/remove", requirePermission("userRole:create"), validationMiddleware("json", removeRoleInputSchema), async (c) => {
    const { userId, roleId } = c.req.valid("json");

    try {
      const userRole = await removeUserRole({ userId, roleId });
      return c.json({ success: true as const, userRole });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
