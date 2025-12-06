import type { User } from "@bunstack/shared/database/types/users";

import { Hono } from "hono";

import { requirePermission } from "@bunstack/api/middlewares/access-control";
import { getAuthContext } from "@bunstack/api/middlewares/auth";
import { validationMiddleware } from "@bunstack/api/middlewares/validation";
import { paginationInputSchema } from "@bunstack/shared/contracts/pagination";
import { checkEmailSchema } from "@bunstack/shared/contracts/users";
import { deleteUserById, findUserById, getUsers, userEmailExists } from "@bunstack/shared/database/queries/users";

export const usersRoutes = new Hono()
  /**
   * Check if an email is available
   * This endpoint does NOT require authentication.
   *
   * @param c - The context
   * @returns Whether the email is available
   */
  .get("/check-email", validationMiddleware("query", checkEmailSchema), async (c) => {
    try {
      const { email } = c.req.valid("query");
      const exists = await userEmailExists(email);

      return c.json({ success: true as const, available: !exists });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  // --- All routes below this point require authentication
  .use(getAuthContext)

  /**
   * Get all users
   *
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
   *
   * @param c - The context
   * @returns The user
   */
  .get("/:id", requirePermission("user:read", c => ({ id: c.req.param("id") })), async (c) => {
    const { id } = c.req.param();

    try {
      const user = await findUserById(id);

      if (!user) {
        return c.json({ success: false, error: "Not Found" }, 404);
      }

      return c.json({ success: true as const, user });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  })

  /**
   * Delete a user by their ID
   *
   * @param c - The context
   * @returns The user
   */
  .delete("/:id", requirePermission("user:delete", c => ({ id: c.req.param("id") })), async (c) => {
    const { id } = c.req.param();

    try {
      const user = await deleteUserById(id);
      return c.json({ success: true as const, user });
    } catch (error) {
      return c.json({ success: false as const, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  });
