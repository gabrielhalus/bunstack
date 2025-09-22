import type { Policy as PolicyDB } from "../db/types/policies";
import type { Role } from "../db/types/roles";
import type { User } from "../db/types/users";
import type { permissions } from "./permissions";

export type Permission = (typeof permissions)[number];

export type Operand
  = | { type: "user_attr"; key: string }
    | { type: "resource_attr"; key: string }
    | { type: "literal"; value: any };

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
