import { deleteUser, getUser, getUsers } from "@bunstack/shared/db/queries/users";
import { Hono } from "hono";

import { requirePermission } from "@/middlewares/access-control";
import { getAuthContext } from "@/middlewares/auth";

export default new Hono()
  .use(getAuthContext)

  /**
   * Get all users
   * @param c - The context
   * @returns All users
   */
  .get("/", requirePermission("user:list"), async (c) => {
    try {
      const params = c.req.query();

      const page = params.page ? Number(params.page) : 0;
      const pageSize = params.pageSize ? Number(params.pageSize) : Number.MAX_SAFE_INTEGER;

      if (Number.isNaN(page) || page < 0 || Number.isNaN(pageSize) || pageSize < 1) {
        return c.json({ success: false, error: "Invalid pagination parameters" }, 400);
      }

      const { users, total } = await getUsers(page, pageSize);

      return c.json({ success: true, users, total });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
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
      return c.json({ success: true, user });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
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
      return c.json({ success: true, user });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
