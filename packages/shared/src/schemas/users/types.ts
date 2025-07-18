import type { Merge } from "types";

import type { usersTable } from "./table";

export type User = Merge<typeof usersTable.$inferSelect, { password?: string }>;

export type UserUniqueFields = Pick<User, "id" | "email">;
