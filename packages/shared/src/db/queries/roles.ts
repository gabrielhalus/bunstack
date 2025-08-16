import { asc, count, desc, eq, inArray } from "drizzle-orm";

import type { Role, RoleOrderBy, RoleUniqueFields, RoleWithMembers, RoleWithMembersCount } from "../types/roles";
import type { User } from "../types/users";

import { db } from "../";
import { Roles } from "../schemas/roles";
import { UserRoles } from "../schemas/user-roles";
import { Users } from "../schemas/users";

const LEVEL_STEP = 10;

/**
 * Fetches a paginated list of roles, each with the count of assigned members.
 *
 * @param page - The current page number (1-based).
 * @param limit - Maximum number of roles to return per page.
 * @param orderBy - Optional ordering criteria for the roles.
 * @returns An object containing the paginated roles with member counts and the total number of roles.
 */
export async function getRoles(page: number, limit: number, orderBy?: RoleOrderBy): Promise<{ roles: RoleWithMembersCount[]; total: number }> {
  const offset = (page - 1) * limit;

  const baseQuery = db.select().from(Roles);

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

  const roles = await orderedQuery.limit(limit).offset(offset).all();

  const enrichedRoles = await Promise.all(
    roles.map(async role => ({
      ...role,
      members: await getRoleMembersCount(role),
    })),
  );

  const { count: total = 0 } = (await db
    .select({ count: count() })
    .from(Roles)
    .get()) ?? {};

  return { roles: enrichedRoles, total };
}

/**
 * Retrieves a single role by a unique field, including all users assigned to that role.
 *
 * @param key - The unique field of the role to search by (e.g., "id", "name").
 * @param value - The value to match for the specified field.
 * @returns The matching role with its members, or undefined if not found.
 */
export async function getRole<T extends keyof RoleUniqueFields>(key: T, value: typeof Roles[T]["_"]["data"]): Promise<RoleWithMembers | undefined> {
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
export async function getUserRoles(user: User, orderBy?: RoleOrderBy) {
  const userRoles = await db.select().from(UserRoles).where(eq(UserRoles.userId, user.id)).all();
  const roleIds = userRoles.map(ur => ur.roleId);

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

  return await orderedQuery.all();
}

/**
 * Update any fields of a role by its ID.
 * @param key - The field to search by
 * @param value - The value to search for
 * @param updates - The fields to update
 * @returns The updated role
 */
export async function updateRole<T extends keyof RoleUniqueFields>(key: T, value: typeof Roles[T]["_"]["data"], updates: Partial<Omit<Role, "id">>): Promise<Role | undefined> {
  return await db.update(Roles).set(updates).where(eq(Roles[key], value)).returning().get();
}

/**
 * Updates the 'level' of a role, ensuring proper ordering and spacing.
 * If there is not enough space between adjacent roles, all roles are re-leveled.
 *
 * @param key - The unique field to identify the role (e.g., "id" or "name").
 * @param value - The value of the unique field.
 * @param requestedLevel - The desired level to move the role to.
 * @returns The updated role, or undefined if not found.
 */
export async function updateRoleLevel<T extends keyof RoleUniqueFields>(key: T, value: typeof Roles[T]["_"]["data"], requestedLevel: number): Promise<Role | undefined> {
  const roles = await db.select().from(Roles).orderBy(asc(Roles.level));

  const movingRoleIndex = roles.findIndex(r => r[key] === value);
  if (movingRoleIndex === -1) {
    throw new Error("Role not found");
  }

  const [movingRole] = roles.splice(movingRoleIndex, 1);

  // Find the best insert position based on the requested level
  let insertIndex = 0;
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].level > requestedLevel) {
      insertIndex = i;
      break;
    }
    insertIndex = i + 1;
  }

  roles.splice(insertIndex, 0, movingRole);

  const prevRole = insertIndex > 0 ? roles[insertIndex - 1] : null;
  const nextRole = insertIndex < roles.length ? roles[insertIndex + 1] : null;

  let newLevel: number;

  if (prevRole && nextRole) {
    // Case: role is in the middle
    const gap = nextRole.level - prevRole.level;
    if (gap > 1) {
      newLevel = Math.floor((nextRole.level + prevRole.level) / 2);
    } else {
      // No space -> full relevel, but preserve the intended order
      await relevelRoles(roles);
      // After releveling, the movingRole should be at the intended insertIndex
      // We need to update it to the correct level based on its new position
      const updatedRoles = await db.select().from(Roles).orderBy(asc(Roles.level));
      const finalInsertIndex = updatedRoles.findIndex(r => r.id === movingRole.id);
      if (finalInsertIndex !== -1) {
        const finalLevel = (finalInsertIndex + 1) * LEVEL_STEP;
        await db.update(Roles).set({ level: finalLevel }).where(eq(Roles.id, movingRole.id));
      }
      // Return the updated role instead of returning early
      return await db.select().from(Roles).where(eq(Roles[key], value)).get();
    }
  } else if (!prevRole && nextRole) {
    // Case: role is at the start
    if (nextRole.level > 1) {
      newLevel = Math.floor(nextRole.level / 2);
    } else {
      // No space -> full relevel, but preserve the intended order
      await relevelRoles(roles);
      // The movingRole should now be at the start (level 10)
      return await db.update(Roles).set({ level: LEVEL_STEP }).where(eq(Roles.id, movingRole.id)).returning().get();
    }
  } else if (prevRole && !nextRole) {
    // Case: role is at the end
    newLevel = prevRole.level + LEVEL_STEP;
  } else {
    // Only one role
    newLevel = LEVEL_STEP;
  }

  return await db.update(Roles).set({ level: newLevel }).where(eq(Roles[key], value)).returning().get();
}

/**
 * Relevels all roles in the given array to have sequential levels starting from LEVEL_STEP.
 * This function is called when there's insufficient space between adjacent role levels.
 *
 * @param roles - Array of roles in the desired order (with movingRole already positioned)
 */
async function relevelRoles(roles: Role[]): Promise<void> {
  let level = LEVEL_STEP;
  for (const role of roles) {
    await db.update(Roles).set({ level }).where(eq(Roles.id, role.id));
    level += LEVEL_STEP;
  }
}

/**
 * Delete a role by its ID.
 *
 * @param key - The field to search by.
 * @param value - The value to search for
 * @returns The deleted role.
 */
export async function deleteRole<T extends keyof RoleUniqueFields>(key: T, value: typeof Roles[T]["_"]["data"]): Promise<Role | undefined> {
  return await db.delete(Roles).where(eq(Roles[key], value)).returning().get();
}
