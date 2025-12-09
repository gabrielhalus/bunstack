import type { Permission } from "@bunstack/shared/types/permissions";
import type { Policy as PolicyDB } from "@bunstack/shared/types/policies";
import type { Role } from "@bunstack/shared/types/roles";
import type { User } from "@bunstack/shared/types/users";

// Re-export Permission for convenience
export type { Permission } from "@bunstack/shared/types/permissions";

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

export type Policy = Omit<PolicyDB, "id">;

export type UserContext = User;

export type RoleContext = Role & {
  permissions: Permission[];
};

