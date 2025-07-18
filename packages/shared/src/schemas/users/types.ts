import type { PermissionEntry } from "access/types";
import type { Role } from "schemas/roles";

import type { Merge } from "types";
import type { usersTable } from "./table";

export type User = Merge<Omit<typeof usersTable.$inferSelect, "password"> & { password?: string }, { roles: Pick<Role, "id" | "label" | "isAdmin">[]; permissions: PermissionEntry[] }>;

export type UserUniqueFields = Pick<User, "id" | "email">;
