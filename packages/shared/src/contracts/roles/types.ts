import type z from "zod";

import type { updateRoleInputSchema } from "./schemas";

export type UpdateRoleInput = z.infer<typeof updateRoleInputSchema>;
