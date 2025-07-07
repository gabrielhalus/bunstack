import { roles } from "./table";

export type Role = typeof roles.$inferSelect;

export type RoleUniqueFields = Pick<Role, "id" | "index" | "name" | "default">;
