import type { Merge } from "../../common";
import type { usersTable } from "./table";

export type User = Merge<Omit<typeof usersTable.$inferSelect, "password"> & { password?: string }, { roles: { id: string; label: string }[] }>;

export type UserUniqueFields = Pick<User, "id" | "email">;
