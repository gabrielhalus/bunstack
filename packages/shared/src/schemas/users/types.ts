import type { Role } from "./relations";
import type { User } from "./table";

export type UserProfile = Omit<User, "password">;

export type UserWithRoles = UserProfile & {
  roles: Role[];
};
