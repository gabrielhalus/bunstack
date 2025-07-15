/* eslint-disable drizzle/enforce-delete-with-where */
import { Hono } from "hono";

import { deleteRole, getAllRoles, getRole } from "@/db/queries/roles";
import { getAuth } from "@/middlewares/auth";

export default new Hono()
  .use(getAuth)

  /**
   * Get all roles
   * @param c - The context
   * @returns All roles
   */
  .get("/", async (c) => {
    try {
      const roles = await getAllRoles();
      return c.json({ success: true, roles });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Get a role by their name
   * @param c - The context
   * @returns The role
   */
  .get("/:name", async (c) => {
    const { name } = c.req.param();

    try {
      const role = await getRole("name", name);
      return c.json({ success: true, role });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Delete a role by their id
   * @param c - The Context
   * @returns The role
   */
  .delete("/:id", async (c) => {
    const { id } = c.req.param();

    try {
      const role = await deleteRole("id", id);
      return c.json({ success: true, user: role });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
