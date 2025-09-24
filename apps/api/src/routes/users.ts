import type { User } from "@bunstack/shared/db/types/users";

import { paginationInputSchema } from "@bunstack/shared/contracts/pagination";
import { deleteUser, getUser, getUsers } from "@bunstack/shared/db/queries/users";
import { Hono } from "hono";

import { requirePermission } from "@/middlewares/access-control";
import { getAuthContext } from "@/middlewares/auth";
import { validationMiddleware } from "@/middlewares/validation";

export default new Hono()
  .use(getAuthContext)

  /**
   * Get all users
   * @param c - The context
   * @returns All users
   */
  .get("/", requirePermission("user:list"), validationMiddleware("query", paginationInputSchema), async (c) => {
    try {
      const { page, pageSize, search, sortField, sortDirection } = c.req.valid("query");

      const orderBy = sortField ? { field: sortField as keyof User, direction: sortDirection } : undefined;
      const { users, total } = await getUsers(page, pageSize, orderBy, search);

      return c.json({ success: true as const, users, total });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Get a user by their ID
   * @param c - The context
   * @returns The user
   */
  .get("/:id", requirePermission("user:read", c => ({ id: c.req.param("id") })), async (c) => {
    const { id } = c.req.param();

    try {
      const user = await getUser("id", id);
      return c.json({ success: true as const, user });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Delete a user by their ID
   * @param c - The context
   * @returns The user
   */
  .delete("/:id", requirePermission("user:delete", c => ({ id: c.req.param("id") })), async (c) => {
    const { id } = c.req.param();

    try {
      const user = await deleteUser("id", id);
      return c.json({ success: true as const, user });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
