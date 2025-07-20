import type { Merge } from "../../types";
import type { Users } from "./table";

export type User = Merge<typeof Users.$inferSelect, { password?: string }>;

export type UserUniqueFields = Pick<User, "id" | "email">;
