import type { Policies } from "./table";

export type Policy = typeof Policies.$inferSelect;

export type Operand =
  | { type: "user_attr"; key: string }
  | { type: "resource_attr"; key: string }
  | { type: "literal"; value: any };

export type Condition =
  | {
    op: "and" | "or";
    conditions: Condition[];
  }
  | {
    op: "not";
    condition: Condition;
  }
  | {
    op: "eq" | "neq" | "lt" | "lte" | "gt" | "gte";
    left: Operand;
    right: Operand;
  }
  | {
    op: "in" | "not_in";
    left: Operand;
    right: Operand[];
  }
  | {
    op: "exists" | "not_exists";
    operand: Operand;
  };
