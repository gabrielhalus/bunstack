import type { OrderBy } from "@bunstack/shared/types/pagination";
import type { Role, RoleWithMembers, RoleWithMembersCount } from "@bunstack/shared/types/roles";
import type { User } from "@bunstack/shared/types/users";

import { asc, count, desc, eq, inArray, like, or } from "drizzle-orm";

import { db } from "@/database";
import { Roles } from "@bunstack/shared/schemas/roles";
import { UserRoles } from "@bunstack/shared/schemas/user-roles";
import { Users } from "@bunstack/shared/schemas/users";

/**
 * Fetches a paginated list of roles, each with the count of assigned members.
 *
 * @param page - The current page number (1-based).
 * @param limit - Maximum number of roles to return per page.
 * @param orderBy - Optional ordering criteria for the roles.
 * @param search - Optional search term to filter roles by name or description.
 * @returns An object containing the paginated roles with member counts and the total number of roles.
 */
export async function getRoles(page: number, limit: number, orderBy?: OrderBy<Role>, search?: string): Promise<{ roles: RoleWithMembersCount[]; total: number }> {
  const offset = (page) * limit;

  // Build search conditions
  const searchConditions = search
    ? or(
        like(Roles.name, `%${search}%`),
        like(Roles.description, `%${search}%`),
      )
    : undefined;

  const baseQuery = db.select().from(Roles).where(searchConditions);

  const orderedQuery = (() => {
    if (typeof orderBy === "string") {
      return baseQuery.orderBy(Roles[orderBy]);
    }

    if (orderBy && typeof orderBy === "object") {
      const { field, direction } = orderBy;
      const column = Roles[field];
      return direction === "asc" ? baseQuery.orderBy(asc(column)) : baseQuery.orderBy(desc(column));
    }

    return baseQuery;
  })();

  const roles = await orderedQuery.limit(limit).offset(offset);

  const enrichedRoles = await Promise.all(
    roles.map(async role => ({
      ...role,
      members: await getRoleMembersCount(role),
    })),
  );

  const totalResult = await db
    .select({ count: count() })
    .from(Roles)
    .where(searchConditions);

  const { count: total = 0 } = totalResult[0] ?? {};

  return { roles: enrichedRoles, total };
}

/**
 * Fetches a role by its name and includes all assigned members.
 *
 * @param name - The role name to search for.
 * @returns The role with its members, or undefined if not found.
 */
export async function getRoleByName(name: Role["name"]): Promise<RoleWithMembers | undefined> {
  const roles = await db.select().from(Roles).where(eq(Roles.name, name));
  if (!roles[0]) {
    return undefined;
  }

  const members = await getRoleMembers(roles[0].id);
  return { ...roles[0], members };
}

/**
 * Retrieves the default role from the database.
 *
 * @returns The default Role if found, undefined otherwise.
 */
export async function getDefaultRole(): Promise<Role | undefined> {
  const roles = await db.select().from(Roles).where(eq(Roles.isDefault, true));
  return roles[0];
}

/**
 * Retrieves the number of users assigned to the specified role.
 *
 * @param role - The role for which to count members.
 * @returns A promise that resolves to the number of users assigned to the role.
 */
async function getRoleMembersCount(role: Role): Promise<number> {
  const totalResult = await db.select({ count: count() }).from(UserRoles).where(eq(UserRoles.roleId, role.id));
  const total = totalResult[0];

  return Number(total?.count ?? 0);
}

/**
 * Retrieves all users who are members of the specified role.
 *
 * @param roleId - The ID of role for which to retrieve members.
 * @returns A promise that resolves to an array of users who are members of the role.
 */
export async function getRoleMembers(roleId: Role["id"]): Promise<User[]> {
  const userToRoles = await db.select().from(UserRoles).where(eq(UserRoles.roleId, roleId));
  const userIds = userToRoles.map(userRole => userRole.userId);

  const users = await db.select().from(Users).where(inArray(Users.id, userIds));

  return users;
}

/**
 * Get all roles assigned to a specific user.
 *
 * @param user - The user object for which to retrieve roles.
 * @returns An array of roles assigned to the user.
 */
export async function getUserRoles(user: User, orderBy?: OrderBy<Role>) {
  const userRoles = await db.select().from(UserRoles).where(eq(UserRoles.userId, user.id));
  const roleIds = userRoles.map(userRole => userRole.roleId);

  const baseQuery = db.select().from(Roles).where(inArray(Roles.id, roleIds));

  const orderedQuery = (() => {
    if (typeof orderBy === "string") {
      return baseQuery.orderBy(Roles[orderBy]);
    }

    if (orderBy && typeof orderBy === "object") {
      const { field, direction } = orderBy;
      const column = Roles[field];
      return direction === "asc" ? baseQuery.orderBy(asc(column)) : baseQuery.orderBy(desc(column));
    }

    return baseQuery;
  })();

  return await orderedQuery;
}

/**
 * Update any fields of a role by its ID.
 *
 * @param id - The role ID to search for.
 * @param data - The fields to update
 * @returns The updated role
 */
export async function updateRoleById(id: Role["id"], data: Partial<Omit<Role, "id">>): Promise<Role | undefined> {
  const updatedRoles = await db.update(Roles).set(data).where(eq(Roles.id, id)).returning();
  return updatedRoles[0];
}

/**
 * Delete a role by its ID.
 *
 * @param id - The role ID to search for.
 * @returns The deleted role.
 */
export async function deleteRoleById(id: Role["id"]): Promise<Role | undefined> {
  const deletedRoles = await db.delete(Roles).where(eq(Roles.id, id)).returning();
  return deletedRoles[0];
}
