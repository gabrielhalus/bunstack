import type { Condition, Operand, UserContext } from "./types";

function getNested(obj: any, path: string): unknown {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function resolveOperand(operand: Operand, user: UserContext, resource?: Record<string, unknown>) {
  switch (operand.type) {
    case "user_attr":
      // Access user properties directly (id, roles, etc.)
      return getNested(user, operand.key);
    case "resource_attr":
      // Access resource properties directly (id, type, etc.)
      return getNested(resource, operand.key);
    case "literal":
      return operand.value;
  }
}

export function evaluateCondition(condition: string | Condition, user: UserContext, resource?: Record<string, unknown>): boolean {
  const cond = typeof condition === "string" ? JSON.parse(condition) as Condition : condition;

  switch (cond.op) {
    case "and":
      return cond.conditions.every(c => evaluateCondition(c, user, resource));
    case "or":
      return cond.conditions.some(c => evaluateCondition(c, user, resource));
    case "not":
      return !evaluateCondition(cond.condition, user, resource);

    case "eq":
      return resolveOperand(cond.left, user, resource) === resolveOperand(cond.right, user, resource);
    case "neq":
      return resolveOperand(cond.left, user, resource) !== resolveOperand(cond.right, user, resource);
    case "lt":
      return resolveOperand(cond.left, user, resource) < resolveOperand(cond.right, user, resource);
    case "lte":
      return resolveOperand(cond.left, user, resource) <= resolveOperand(cond.right, user, resource);
    case "gt":
      return resolveOperand(cond.left, user, resource) > resolveOperand(cond.right, user, resource);
    case "gte":
      return resolveOperand(cond.left, user, resource) >= resolveOperand(cond.right, user, resource);

    case "in": {
      const left = resolveOperand(cond.left, user, resource);
      return cond.right.some(r => left === resolveOperand(r, user, resource));
    }
    case "not_in": {
      const left = resolveOperand(cond.left, user, resource);
      return cond.right.every(r => left !== resolveOperand(r, user, resource));
    }

    case "exists": {
      const value = resolveOperand(cond.operand, user, resource);
      return value !== undefined && value !== null;
    }
    case "not_exists": {
      const value = resolveOperand(cond.operand, user, resource);
      return value === undefined || value === null;
    }

    default:
      throw new Error(`Unsupported condition operator: ${(cond as any).op}`);
  }
}
