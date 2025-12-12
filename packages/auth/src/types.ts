import type { Permission } from "@bunstack/shared/types/permissions";
import type { Policy as PolicyShared } from "@bunstack/shared/types/policies";
import type { Role as RoleShared } from "@bunstack/shared/types/roles";
import type { User as UserShared } from "@bunstack/shared/types/users";

export type Operand
  = | { type: "user_attr"; key: string }
    | { type: "resource_attr"; key: string }
    | { type: "literal"; value: unknown };

export type Condition
  = | { op: "and"; conditions: Condition[] }
    | { op: "or"; conditions: Condition[] }
    | { op: "not"; condition: Condition }
    | { op: "eq" | "neq" | "lt" | "lte" | "gt" | "gte"; left: Operand; right: Operand }
    | { op: "in" | "not_in"; left: Operand; right: Operand[] }
    | { op: "exists" | "not_exists"; operand: Operand };

export type User = UserShared;

export type Policy = Omit<PolicyShared, "id">;

export type { Permission } from "@bunstack/shared/types/permissions";

export type Role = RoleShared & { permissions: Permission[] };

export type Session = {
  user: User;
  roles: Role[];
  policies: Policy[];
  isAdmin: boolean;
  isAuthenticated: true;
  can: (permission: Permission, resource?: Record<string, unknown>) => boolean;
};
