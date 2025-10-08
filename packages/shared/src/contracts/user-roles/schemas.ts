import { z } from "zod";

export const assignRoleInputSchema = z.object({
  userId: z.string(),
  roleId: z.number(),
});

export const removeRoleInputSchema = z.object({
  userId: z.string(),
  roleId: z.number(),
});
