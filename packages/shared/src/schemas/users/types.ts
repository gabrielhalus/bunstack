import type { Merge } from "../../common";
import type { users } from "./table";

export const ROLES = ["admin", "manager", "user"] as const;
export type Role = (typeof ROLES)[number];

export type User = Merge<Omit<typeof users.$inferSelect, "password"> & { password?: string } & { roles: Role[] }>;
