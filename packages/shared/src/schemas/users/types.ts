import { Merge } from "common";
import type { Role } from "./relations";
import { users } from "./table";

export type User = Merge<Omit<typeof users.$inferSelect, "password"> & { password?: string } & { roles: Role[] }>;
