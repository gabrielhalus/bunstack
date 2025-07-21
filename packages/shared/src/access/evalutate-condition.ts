import type { Condition, Operand } from "../schemas/policies/types";
import type { ResourceContext, UserContext } from "./types";

function getNested(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function resolveOperand(operand: Operand, user: UserContext, resource?: ResourceContext) {
  switch (operand.type) {
    case "user_attr":
      return getNested(user.attributes, operand.key);
    case "resource_attr":
      return getNested(resource?.attributes, operand.key);
    case "literal":
      return operand.value;
  }
}

export function evaluateCondition(cond: Condition, user: UserContext, resource?: ResourceContext): boolean {
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
