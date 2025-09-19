import type { Policy as PolicyDB } from "../db/types/policies";
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

export type UserContext = {
  id: string;
  [key: string]: unknown;
};

export type RoleContext = {
  id: number;
  index: number;
  isSuperAdmin: boolean;
  permissions: Permission[];
};
