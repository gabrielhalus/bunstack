import type { updateRoleInputSchema } from "./schemas";
import type z from "zod";

export type UpdateRoleInput = z.infer<typeof updateRoleInputSchema>;
