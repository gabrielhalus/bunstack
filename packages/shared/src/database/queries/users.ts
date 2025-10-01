import type { Policy } from "@bunstack/shared/access/types";
import type { RoleWithPermissions } from "@bunstack/shared/database/types/roles";
import type { insertUserSchema, User, UserOrderBy, UserUniqueFields, UserWithRoles } from "@bunstack/shared/database/types/users";
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
export async function getUsers(page: number, limit: number, orderBy?: UserOrderBy, search?: string): Promise<{ users: Array<UserWithRoles>; total: number }> {
  const offset = (page) * limit;

  // Build search conditions
  const searchConditions = search
    ? or(
        like(Users.name, `%${search}%`),
        like(Users.email, `%${search}%`),
      )
    : undefined;

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

  const users = await orderedQuery.limit(limit).offset(offset).all();

  const enrichedUsers = await Promise.all(users.map(async user => ({
    ...user,
    password: undefined,
    roles: await getUserRoles(user, { field: "index", direction: "desc" }),
  })));

  const { count: total = 0 } = (await db
    .select({ count: count() })
    .from(Users)
    .where(searchConditions)
    .get()) ?? {};

  return { users: enrichedUsers, total };
}

/**
 * Retrieves a single user by a unique field, including their associated roles.
 *
 * @param key - The unique field of the user to search by (e.g., "id", "email").
 * @param value - The value to match for the specified field.
 * @param keepPassword - If true, includes the password field in the result (useful for authentication).
 * @returns The matching user with their roles, or undefined if not found.
 */
export async function getUser<T extends keyof UserUniqueFields>(key: T, value: typeof Users[T]["_"]["data"], keepPassword: boolean = false): Promise<UserWithRoles | undefined> {
  const user = await db.select().from(Users).where(eq(Users[key], value)).get();

  if (!user) {
    return undefined;
  }

  const enrichedUser = {
    ...user,
    password: keepPassword ? user.password : undefined,
    roles: await getUserRoles(user, { field: "index", direction: "desc" }),
  };

  return enrichedUser;
}

export async function getUserExists<T extends keyof UserUniqueFields>(key: T, value: typeof Users[T]["_"]["data"]): Promise<boolean> {
  const exists = await db.select({ exists: Users[key] }).from(Users).where(eq(Users[key], value)).limit(1);

  return exists.length > 0;
}

/**
 * Get a user along with their associated roles by its ID, always including the password (for auth).
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The matching user, with password.
 */
export async function getUserWithPassword<T extends keyof UserUniqueFields>(key: T, value: typeof Users[T]["_"]["data"]): Promise<UserWithRoles | undefined> {
  return getUser(key, value, true);
}

/**
 * Retrieves a user along with their associated roles and permissions.
 *
 * @param key - The unique field key to search by (e.g., "id", "email").
 * @param value - The value to search for.
 * @returns An object containing the user (or undefined if not found), their roles, and their permissions.
 */
export async function getUserWithContext<T extends keyof UserUniqueFields>(key: T, value: typeof Users[T]["_"]["data"]): Promise<{ user: User | undefined; roles: RoleWithPermissions[]; policies: Policy[] }> {
  const user = await db.select().from(Users).where(eq(Users[key], value)).get();
  if (!user) {
    return { user: undefined, roles: [], policies: [] };
  }

  const roles = await getUserRoles(user, { field: "index", direction: "asc" });

  // Assign permissions to each role
  const rolesWithPermissions = await Promise.all(
    roles.map(async (role) => {
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
  const insertedUser = await db.insert(Users).values(user).returning().get();

  const defaultRole = await getDefaultRole();
  if (defaultRole) {
    await db.insert(UserRoles).values({ userId: insertedUser.id, roleId: defaultRole.id });
  }

  return insertedUser;
}

/**
 * Delete a user by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for.
 * @returns The deleted user.
 */
export async function deleteUser<T extends keyof UserUniqueFields>(key: T, value: typeof Users[T]["_"]["data"]): Promise<User | undefined> {
  return await db.delete(Users).where(eq(Users[key], value)).returning().get();
}
