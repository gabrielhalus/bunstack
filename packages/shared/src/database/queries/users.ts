import type { OrderBy } from "../../types/pagination";
import type { Policy } from "@bunstack/shared/access/types";
import type { RoleWithPermissions } from "@bunstack/shared/database/types/roles";
import type { insertUserSchema, User, UserWithRoles } from "@bunstack/shared/database/types/users";
import type z from "zod";

import { asc, count, desc, eq, like, or } from "drizzle-orm";

import { UserRoles } from "../schemas/user-roles";
import { db } from "@bunstack/shared/database";
import { getApplicablePolicies } from "@bunstack/shared/database/queries/policies";
import { getRolePermissions } from "@bunstack/shared/database/queries/role-permissions";
import { getDefaultRole, getUserRoles } from "@bunstack/shared/database/queries/roles";
import { Users } from "@bunstack/shared/database/schemas/users";

/**
 * Retrieves a paginated list of users, each including their associated roles.
 *
 * @param page - The page number to retrieve (1-based).
 * @param limit - The number of users to retrieve per page.
 * @param orderBy - Optional ordering criteria for the user.
 * @param search - Optional search term to filter by name or email.
 * @returns An object containing an array of users with their roles and the total number of users.
 */
export async function getUsers(page: number, limit: number, orderBy?: OrderBy<User>, search?: string): Promise<{ users: Array<UserWithRoles>; total: number }> {
  const offset = (page) * limit;

  // Build search conditions
  const searchConditions = search ? or(like(Users.name, `%${search}%`), like(Users.email, `%${search}%`)) : undefined;

  const baseQuery = db.select().from(Users).where(searchConditions);

  const orderedQuery = (() => {
    if (typeof orderBy === "string") {
      return baseQuery.orderBy(Users[orderBy]);
    }

    if (orderBy && typeof orderBy === "object") {
      const { field, direction } = orderBy;
      const column = Users[field];
      return direction === "asc" ? baseQuery.orderBy(asc(column)) : baseQuery.orderBy(desc(column));
    }

    return baseQuery;
  })();

  const users = await orderedQuery.limit(limit).offset(offset);

  const enrichedUsers = await Promise.all(users.map(async (user: User) => ({
    ...user,
    password: undefined,
    roles: await getUserRoles(user, { field: "index", direction: "desc" }),
  })));

  const totalResult = await db.select({ count: count() }).from(Users).where(searchConditions);

  const { count: total = 0 } = totalResult[0] ?? {};

  return { users: enrichedUsers, total };
}

/**
 * Retrieves a single user by their ID.
 *
 * @param id - The user ID to search for.
 * @returns The matching user, or undefined if not found.
 */
export async function findUserById(id: string): Promise<User | undefined> {
  const users = await db.select().from(Users).where(eq(Users.id, id));
  return users[0];
}

/**
 * Checks if a user exists by their email.
 *
 * @param email - The email address to check.
 * @returns `true` if a user with the given email exists, otherwise `false`.
 */
export async function userEmailExists(email: User["email"]): Promise<boolean> {
  const exists = await db.select({ exists: Users.email }).from(Users).where(eq(Users.email, email)).limit(1);

  return exists.length > 0;
}

/**
 * Get a user including the password (for auth).
 *
 * @param email - The email to search for.
 * @returns The matching user, with password.
 */
export async function findUserWithPassword(email: User["email"]): Promise<User | undefined> {
  const users = await db.select().from(Users).where(eq(Users.email, email));
  return users[0];
}

/**
 * Retrieves a user along with their associated roles and permissions.
 *
 * @param id - The ID to search for.
 * @returns An object containing the user (or undefined if not found), their roles, and their permissions.
 */
export async function findUserWithContext(id: User["id"]): Promise<{ user: User | undefined; roles: RoleWithPermissions[]; policies: Policy[] }> {
  const users = await db.select().from(Users).where(eq(Users.id, id));
  const user = users[0];

  if (!user) {
    return { user: undefined, roles: [], policies: [] };
  }

  const roles = await getUserRoles(user, { field: "index", direction: "asc" });

  // Assign permissions to each role
  const rolesWithPermissions = await Promise.all(
    roles.map(async (role: any) => {
      const rolePermissions = await getRolePermissions(role);
      return {
        ...role,
        permissions: rolePermissions.map(({ permission }) => permission),
      };
    }),
  );

  // Collect all policies for all role-permission pairs
  const policiesMap = new Map<number, Policy>();

  for (const role of rolesWithPermissions) {
    for (const permission of role.permissions) {
      const foundPolicies = await getApplicablePolicies(role.id, permission);
      for (const policy of foundPolicies) {
        policiesMap.set(policy.id, policy);
      }
    }
  }

  const policies = Array.from(policiesMap.values());

  return { user, roles: rolesWithPermissions, policies };
}

/**
 * Insert a new user.
 *
 * @param user - The user data to insert.
 * @returns The inserted user.
 */
export async function insertUser(user: z.infer<typeof insertUserSchema>): Promise<User> {
  const insertedUsers = await db.insert(Users).values(user).returning();
  const insertedUser = insertedUsers[0];

  if (!insertedUser) {
    throw new Error("Failed to insert user");
  }

  const defaultRole = await getDefaultRole();
  if (defaultRole) {
    await db.insert(UserRoles).values({ userId: insertedUser.id, roleId: defaultRole.id });
  }

  return insertedUser;
}

/**
 * Update any fields of a user by its ID.
 *
 * @param id - The ID to search for.
 * @param data - The data to update.
 * @returns The updated user.
 */
export async function updateUserById(id: User["id"], data: Partial<User>): Promise<User | undefined> {
  const updatedUsers = await db.update(Users).set(data).where(eq(Users.id, id)).returning();
  return updatedUsers[0];
}

/**
 * Delete a user by its ID.
 *
 * @param id - The ID to search for.
 * @returns The deleted user.
 */
export async function deleteUserById(id: User["id"]): Promise<User | undefined> {
  const deletedUsers = await db.delete(Users).where(eq(Users.id, id)).returning();
  return deletedUsers[0];
}
