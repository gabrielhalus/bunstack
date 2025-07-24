import { deleteUser, getUser, getUsers } from "@bunstack/shared/db/queries/users";
import { Hono } from "hono";

import { getAuthContext } from "@/middlewares/auth";
import { requireOwnResource, requirePermission } from "@/middlewares/authorization";

export default new Hono()
  .use(getAuthContext)

  /**
   * Get all users
   * @param c - The context
   * @returns All users
   */
  .get("/", requirePermission("list:users"), async (c) => {
    try {
      const page = Number(c.req.query("page") ?? "1");
      const limit = Number(c.req.query("limit") ?? "25");

      if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
        return c.json({ success: false, error: "Invalid pagination parameters" }, 400);
      }

      const { users, total } = await getUsers(page, limit);

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
  .get("/:id", requireOwnResource("view:users"), async (c) => {
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
  .delete("/:id", requireOwnResource("delete:users"), async (c) => {
    const { id } = c.req.param();

    try {
      const user = await deleteUser("id", id);
      return c.json({ success: true, user });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
