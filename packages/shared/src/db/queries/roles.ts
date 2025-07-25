import { count, eq, inArray } from "drizzle-orm";

import type { Role, RoleUniqueFields, RoleWithMembers, RoleWithMembersCount } from "../types/roles";
import type { User } from "../types/users";

import { db } from "../";
import { Roles } from "../schemas/roles";
import { UserRoles } from "../schemas/user-roles";
import { Users } from "../schemas/users";

/**
 * Retrieves a paginated list of roles, including the number of members for each role.
 *
 * @param page - The page number to retrieve (1-based).
 * @param limit - The number of roles to retrieve per page.
 * @returns An object containing an array of roles with member counts and the total number of roles.
 */
export async function getRoles(page: number, limit: number): Promise<{ roles: RoleWithMembersCount[]; total: number }> {
  const roles = await db.select().from(Roles).limit(limit).offset((page - 1) * limit).all();

  const enrichedRoles = await Promise.all(roles.map(async role => ({
    ...role,
    members: await getRoleMembersCount(role),
  })));

  const total = await db.select({ count: count() }).from(Roles).get();

  return { roles: enrichedRoles, total: Number(total?.count ?? 0) };
}

/**
 * Retrieves a single role by a unique field, including all users assigned to that role.
 *
 * @param key - The unique field of the role to search by (e.g., "id", "name").
 * @param value - The value to match for the specified field.
 * @returns The matching role with its members, or undefined if not found.
 */
export async function getRole(key: keyof RoleUniqueFields, value: any): Promise<RoleWithMembers | undefined> {
  const role = await db.select().from(Roles).where(eq(Roles[key], value)).get();

  if (!role) {
    return undefined;
  }

  const enrichedRole = {
    ...role,
    members: await getRoleMembers(role),
  };

  return enrichedRole;
}

/**
 * Retrieves the number of users assigned to the specified role.
 *
 * @param role - The role for which to count members.
 * @returns A promise that resolves to the number of users assigned to the role.
 */
async function getRoleMembersCount(role: Role): Promise<number> {
  const total = await db.select({ count: count() }).from(UserRoles).where(eq(UserRoles.roleId, role.id)).get();

  return Number(total?.count ?? 0);
}

/**
 * Retrieves all users who are members of the specified role.
 *
 * @param role - The role for which to retrieve members.
 * @returns A promise that resolves to an array of users who are members of the role.
 */
export async function getRoleMembers(role: Role): Promise<User[]> {
  const userToRoles = await db.select().from(UserRoles).where(eq(UserRoles.roleId, role.id)).all();
  const userIds = userToRoles.map(ur => ur.userId);

  const users = await db.select().from(Users).where(inArray(Users.id, userIds)).all();

  return users;
}

/**
 * Get all roles assigned to a specific user.
 *
 * @param user - The user object for which to retrieve roles.
 * @returns An array of roles assigned to the user.
 */
export async function getUserRoles(user: User) {
  const userToRoles = await db.select().from(UserRoles).where(eq(UserRoles.userId, user.id)).all();
  const roleIds = userToRoles.map(ur => ur.roleId);

  const userRoles = await db.select().from(Roles).where(inArray(Roles.id, roleIds)).all();

  return userRoles;
}
