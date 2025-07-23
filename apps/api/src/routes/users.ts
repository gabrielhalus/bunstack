import { deleteUser, getAllUsers, getUser } from "@bunstack/shared/db/queries/users";
import { Hono } from "hono";

import { getAuthContext } from "@/middlewares/auth";

export default new Hono()
  .use(getAuthContext)

  /**
   * Get all users
   * @param c - The context
   * @returns All users
   */
  .get("/", async (c) => {
    try {
      const users = await getAllUsers();
      return c.json({ success: true, users: users.map(user => ({ ...user, password: undefined })) });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Get a user by their ID
   * @param c - The context
   * @returns The user
   */
  .get("/:id", async (c) => {
    const { id } = c.req.param();

    try {
      const user = await getUser("id", id);
      return c.json({ success: true, user: { ...user, password: undefined } });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Delete a user by their ID
   * @param c - The context
   * @returns The user
   */
  .delete("/:id", async (c) => {
    const { id } = c.req.param();

    try {
      const user = await deleteUser("id", id);
      return c.json({ success: true, user });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
