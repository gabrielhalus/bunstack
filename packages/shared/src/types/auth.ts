import type { Permission } from "@/types/permissions";
import type { Policy } from "@/types/policies";
import type { Role } from "@/types/roles";
import type { User } from "@/types/users";

export type Session = {
  user: User;
  roles: Role[];
  policies: Policy[];
  isAdmin: boolean;
  isAuthenticated: true;
  can: (permission: Permission, resource?: Record<string, unknown>) => boolean;
};
