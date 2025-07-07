import type { Merge } from "../../common";
import type { users } from "./table";

export type User = Merge<Omit<typeof users.$inferSelect, "password"> & { password?: string }, { roles: string[] }>;

export type UserUniqueFields = Pick<User, "id" | "email">;
