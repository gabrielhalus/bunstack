import { z } from "zod";

export const updateRoleInputSchema = z.object({
  label: z.string().min(1, "Label is required"),
  description: z.string().nullable(),
});
